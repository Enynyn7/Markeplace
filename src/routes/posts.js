const express = require('express');
const router = express.Router();
const db = require('../config/db');

async function getAccountId(client, userId) {
  const { rows } = await client.query(
    'SELECT id FROM financial_account WHERE user_id = $1 ORDER BY id LIMIT 1',
    [userId]
  );

  if (rows.length > 0) return rows[0].id;

  const { rows: created } = await client.query(
    `INSERT INTO financial_account (user_id, account_type, currency, balance)
     VALUES ($1, 'standard', 'MXN', 0.00)
     RETURNING id`,
    [userId]
  );

  return created[0].id;
}

function normalizeTicketId(body) {
  return body.ticket_id || body.ticketId || body.lottery_ticket_id || body.selectedTicketId || null;
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        CASE
          WHEN lt.id IS NULL THEN NULL
          ELSE json_build_object(
            'ticket_id', lt.id,
            'folio', lt.subject,
            'description', lt.description,
            'status', lt.status,
            'event_id', lt.event_id
          )
        END AS ticket,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url,
              'alt_text', pi.alt_text,
              'sort_order', pi.sort_order
            ) ORDER BY pi.sort_order
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS images
      FROM post p
      LEFT JOIN category c ON c.id = p.category_id
      LEFT JOIN lottery_ticket lt ON lt.id = p.ticket_id
      LEFT JOIN post_image pi ON p.id = pi.post_id
      GROUP BY p.id, c.id, lt.id
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('[posts/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        CASE
          WHEN lt.id IS NULL THEN NULL
          ELSE json_build_object(
            'ticket_id', lt.id,
            'folio', lt.subject,
            'description', lt.description,
            'status', lt.status,
            'event_id', lt.event_id
          )
        END AS ticket,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url,
              'alt_text', pi.alt_text,
              'sort_order', pi.sort_order
            ) ORDER BY pi.sort_order
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS images
      FROM post p
      LEFT JOIN category c ON c.id = p.category_id
      LEFT JOIN lottery_ticket lt ON lt.id = p.ticket_id
      LEFT JOIN post_image pi ON p.id = pi.post_id
      WHERE p.id = $1
      GROUP BY p.id, c.id, lt.id
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ message: 'Detalle de producto obtenido correctamente', data: rows[0] });
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
      status,
      published_at
    } = req.body;

    const rawTicketId = normalizeTicketId(req.body);
    const ticketId = rawTicketId === null || rawTicketId === undefined || rawTicketId === '' ? null : Number(rawTicketId);
    const normalizedPrice = price === undefined || price === null || price === '' ? null : Number(price);

    if (!category_id) return res.status(400).json({ message: 'Selecciona una categoría válida' });
    if (!author_user_id) return res.status(400).json({ message: 'Usuario autor requerido' });
    if (!title || !String(title).trim()) return res.status(400).json({ message: 'Título requerido' });
    if (!slug || !String(slug).trim()) return res.status(400).json({ message: 'Slug requerido' });

    if (normalizedPrice === null || !Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: 'Ingresa un precio válido' });
    }

    if (ticketId !== null && (!Number.isInteger(ticketId) || ticketId <= 0)) {
      return res.status(400).json({ message: 'Selecciona un boleto válido' });
    }

    await client.query('BEGIN');

    const sellerResult = await client.query(
      `
      SELECT
        u.id,
        u.status,
        r.name AS role_name,
        p.user_type
      FROM "user" u
      LEFT JOIN role r ON r.id = u.role_id
      LEFT JOIN profile p ON p.user_id = u.id
      WHERE u.id = $1
      `,
      [author_user_id]
    );

    if (sellerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Usuario autor no encontrado' });
    }

    const seller = sellerResult.rows[0];

    if (String(seller.status || '').toLowerCase() !== 'active') {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'El usuario autor no está activo' });
    }

    if (seller.role_name === 'auditor') {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'El auditor solo puede consultar información' });
    }

    if (seller.user_type !== 'student') {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Solo los estudiantes pueden publicar en Marketplace' });
    }

    const categoryResult = await client.query(
      'SELECT id, name, slug FROM category WHERE id = $1',
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Categoría no encontrada' });
    }

    const category = categoryResult.rows[0];
    const categoryKey = String(category.slug || category.name || '').toLowerCase();
    const isTicketPost = categoryKey.includes('boleto') || categoryKey.includes('ticket');

    if (isTicketPost && !ticketId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Selecciona un boleto disponible para publicar' });
    }

    let linkedTicketId = null;

    if (isTicketPost) {
      const ticketResult = await client.query(
        `
        SELECT id, user_id, status, subject, description
        FROM lottery_ticket
        WHERE id = $1
        FOR UPDATE
        `,
        [ticketId]
      );

      if (ticketResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Boleto no encontrado' });
      }

      const ticket = ticketResult.rows[0];

      if (Number(ticket.user_id) !== Number(author_user_id)) {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: 'No puedes publicar un boleto que no te pertenece' });
      }

      if (String(ticket.status || '').toLowerCase() !== 'available') {
        await client.query('ROLLBACK');
        return res.status(409).json({ message: 'Este boleto ya no está disponible para publicarse' });
      }

      const alreadyListed = await client.query(
        'SELECT id FROM post WHERE ticket_id = $1 LIMIT 1',
        [ticketId]
      );

      if (alreadyListed.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ message: 'Este boleto ya está ligado a una publicación' });
      }

      linkedTicketId = ticket.id;
    }

    const postResult = await client.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'draft'), $8, $9, $10)
      RETURNING *
      `,
      [
        category_id,
        author_user_id,
        title,
        slug,
        content || null,
        normalizedPrice,
        status,
        published_at || null,
        isTicketPost,
        linkedTicketId
      ]
    );

    if (isTicketPost && linkedTicketId) {
      await client.query(
        `
        UPDATE lottery_ticket
        SET status = 'listed',
            updated_at = NOW()
        WHERE id = $1
        `,
        [linkedTicketId]
      );
    }

    const accountId = await getAccountId(client, author_user_id);

    await client.query(
      `
      INSERT INTO transaction (user_id, financial_account_id, amount, currency, status, description)
      VALUES ($1, $2, 0, 'MXN', 'completed', $3)
      `,
      [author_user_id, accountId, `Publicación creada: ${title}`]
    );

    await client.query('COMMIT');

    res.status(201).json({ message: 'Post creado', data: postResult.rows[0] });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('[posts/post rollback]', rollbackErr.message);
    }

    console.error('[posts/post]', err);

    if (err.code === '23505') {
      return res.status(409).json({ message: 'Ya existe una publicación con ese slug o boleto' });
    }

    if (err.code === '22P02') {
      return res.status(400).json({ message: 'Selecciona un boleto válido' });
    }

    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { category_id, title, slug, content, price, status, published_at } = req.body;

    const { rows } = await db.query(
      `
      UPDATE post
      SET category_id  = COALESCE($1, category_id),
          title        = COALESCE($2, title),
          slug         = COALESCE($3, slug),
          content      = COALESCE($4, content),
          price        = COALESCE($5, price),
          status       = COALESCE($6, status),
          published_at = COALESCE($7, published_at),
          updated_at   = NOW()
      WHERE id = $8
      RETURNING *
      `,
      [category_id, title, slug, content, price, status, published_at, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ message: `Post ${req.params.id} actualizado`, data: rows[0] });
  } catch (err) {
    console.error('[posts/put]', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const postResult = await client.query(
      'SELECT id, ticket_id FROM post WHERE id = $1 FOR UPDATE',
      [req.params.id]
    );

    if (postResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const post = postResult.rows[0];

    await client.query('DELETE FROM post WHERE id = $1', [req.params.id]);

    if (post.ticket_id) {
      await client.query(
        `
        UPDATE lottery_ticket
        SET status = 'available',
            updated_at = NOW()
        WHERE id = $1
          AND status = 'listed'
        `,
        [post.ticket_id]
      );
    }

    await client.query('COMMIT');

    res.json({ message: `Post ${req.params.id} eliminado` });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('[posts/delete rollback]', rollbackErr.message);
    }

    console.error('[posts/delete]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;



