const express = require('express');
const router = express.Router();
const db = require('../config/db');

function normalizeBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function normalizePrice(value) {
  const price = Number(value || 0);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

async function getUserAccess(client, userId) {
  const { rows } = await client.query(
    `
    SELECT
      u.id,
      u.email,
      u.status,
      r.name AS role_name,
      p.user_type,
      p.student_id,
      p.scholarship_percent
    FROM "user" u
    LEFT JOIN role r ON r.id = u.role_id
    LEFT JOIN profile p ON p.user_id = u.id
    WHERE u.id = $1
    `,
    [userId]
  );

  return rows[0] || null;
}

function canSell(user) {
  const role = String(user?.role_name || '').toLowerCase();
  const userType = String(user?.user_type || '').toLowerCase();

  return userType === 'student' || role === 'admin' || role === 'staff';
}

async function buildPostResponse(client, postId) {
  const { rows } = await client.query(
    `
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug,
      u.email AS author_email,
      pr.first_name AS author_first_name,
      pr.last_name AS author_last_name,
      lt.subject AS ticket_folio,
      lt.description AS ticket_description,
      lt.status AS ticket_status,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'url', pi.url,
            'alt_text', pi.alt_text,
            'sort_order', pi.sort_order
          )
          ORDER BY pi.sort_order, pi.id
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
      ) AS images
    FROM post p
    LEFT JOIN category c ON c.id = p.category_id
    LEFT JOIN "user" u ON u.id = p.author_user_id
    LEFT JOIN profile pr ON pr.user_id = p.author_user_id
    LEFT JOIN lottery_ticket lt ON lt.id = p.ticket_id
    LEFT JOIN post_image pi ON pi.post_id = p.id
    WHERE p.id = $1
    GROUP BY p.id, c.id, u.id, pr.id, lt.id
    `,
    [postId]
  );

  return rows[0] || null;
}

router.get('/', async (req, res) => {
  try {
    const { category_id, author_user_id, status } = req.query;

    const conditions = [];
    const params = [];

    if (category_id) {
      params.push(category_id);
      conditions.push(`p.category_id = $${params.length}`);
    }

    if (author_user_id) {
      params.push(author_user_id);
      conditions.push(`p.author_user_id = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`p.status = $${params.length}`);
    } else {
      conditions.push(`p.status = 'published'`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await db.query(
      `
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        u.email AS author_email,
        pr.first_name AS author_first_name,
        pr.last_name AS author_last_name,
        lt.subject AS ticket_folio,
        lt.description AS ticket_description,
        lt.status AS ticket_status,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url,
              'alt_text', pi.alt_text,
              'sort_order', pi.sort_order
            )
            ORDER BY pi.sort_order, pi.id
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM post p
      LEFT JOIN category c ON c.id = p.category_id
      LEFT JOIN "user" u ON u.id = p.author_user_id
      LEFT JOIN profile pr ON pr.user_id = p.author_user_id
      LEFT JOIN lottery_ticket lt ON lt.id = p.ticket_id
      LEFT JOIN post_image pi ON pi.post_id = p.id
      ${where}
      GROUP BY p.id, c.id, u.id, pr.id, lt.id
      ORDER BY p.id DESC
      `,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error('[posts/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await buildPostResponse(db, req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    res.json(post);
  } catch (err) {
    console.error('[posts/get/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const client = await db.connect();

  try {
    const {
      category_id,
      author_user_id,
      title,
      slug,
      content,
      price,
      status = 'published',
      includes_ticket,
      ticket_id
    } = req.body;

    if (!category_id || !author_user_id || !title || !slug || !content) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: category_id, author_user_id, title, slug y content'
      });
    }

    await client.query('BEGIN');

    const author = await getUserAccess(client, author_user_id);

    if (!author || String(author.status).toLowerCase() !== 'active') {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    if (!canSell(author)) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        message: 'Solo los estudiantes pueden crear publicaciones de venta'
      });
    }

    const shouldAttachTicket = normalizeBoolean(includes_ticket) || Boolean(ticket_id);
    let finalTicketId = null;

    if (shouldAttachTicket) {
      if (!ticket_id) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Selecciona un boleto para esta publicación' });
      }

      const { rows: ticketRows } = await client.query(
        `
        SELECT id, user_id, status, subject, description
        FROM lottery_ticket
        WHERE id = $1
        FOR UPDATE
        `,
        [ticket_id]
      );

      if (ticketRows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Boleto no encontrado' });
      }

      const ticket = ticketRows[0];

      const role = String(author.role_name || '').toLowerCase();

      if (!['admin', 'staff'].includes(role) && String(ticket.user_id) !== String(author_user_id)) {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: 'No puedes publicar boletos de otro usuario' });
      }

      if (String(ticket.status || '').toLowerCase() !== 'available') {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Este boleto no está disponible' });
      }

      const { rows: usedRows } = await client.query(
        'SELECT id FROM post WHERE ticket_id = $1 LIMIT 1',
        [ticket_id]
      );

      if (usedRows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Este boleto ya está ligado a otra publicación' });
      }

      finalTicketId = Number(ticket_id);
    }

    const { rows } = await client.query(
      `
      INSERT INTO post (
        category_id,
        author_user_id,
        title,
        slug,
        content,
        price,
        status,
        published_at,
        includes_ticket,
        ticket_id
      )
      VALUES (
        $1::integer,
        $2::integer,
        $3::text,
        $4::text,
        $5::text,
        $6::numeric,
        $7::text,
        CASE WHEN $7::text = 'published' THEN NOW() ELSE NULL::timestamp END,
        $8::boolean,
        $9::integer
      )
      RETURNING *
      `,
      [
        category_id,
        author_user_id,
        title,
        slug,
        content,
        normalizePrice(price),
        status,
        shouldAttachTicket,
        finalTicketId
      ]
    );

    const post = rows[0];

    if (finalTicketId) {
      await client.query(
        `
        UPDATE lottery_ticket
        SET status = 'listed',
            updated_at = NOW()
        WHERE id = $1
        `,
        [finalTicketId]
      );
    }

    await client.query(
      `
      INSERT INTO transaction (user_id, amount, currency, status, description)
      VALUES ($1, 0.00, 'MXN', 'completed', $2)
      `,
      [author_user_id, `Publicacion creada: ${title}`]
    );

    await client.query('COMMIT');

    const responsePost = await buildPostResponse(db, post.id);

    res.status(201).json({
      message: finalTicketId ? 'Publicación creada con boleto' : 'Post creado',
      data: responsePost || post
    });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('[posts/post rollback]', rollbackErr.message);
    }

    console.error('[posts/post]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.delete('/:id', async (req, res) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT id, ticket_id FROM post WHERE id = $1 FOR UPDATE',
      [req.params.id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const post = rows[0];

    await client.query('DELETE FROM post WHERE id = $1', [req.params.id]);

    if (post.ticket_id) {
      const { rows: saleRows } = await client.query(
        'SELECT id FROM ticket_sale WHERE ticket_id = $1 LIMIT 1',
        [post.ticket_id]
      );

      if (saleRows.length === 0) {
        await client.query(
          `
          UPDATE lottery_ticket
          SET status = 'available',
              updated_at = NOW()
          WHERE id = $1 AND status IN ('listed', 'reserved')
          `,
          [post.ticket_id]
        );
      }
    }

    await client.query('COMMIT');

    res.json({ message: `Publicación ${req.params.id} eliminada` });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('[posts/delete rollback]', rollbackErr.message);
    }

    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
