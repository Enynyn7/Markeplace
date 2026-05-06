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

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
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
      LEFT JOIN post_image pi ON p.id = pi.post_id
      GROUP BY p.id
      ORDER BY p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
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
      LEFT JOIN post_image pi ON p.id = pi.post_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post no encontrado' });
    res.json({ message: 'Detalle de producto obtenido correctamente', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    const { category_id, author_user_id, title, slug, content, price, status, published_at } = req.body;
    const normalizedPrice = price === undefined || price === null || price === '' ? null : Number(price);

    if (!category_id) return res.status(400).json({ message: 'Selecciona una categoria valida' });
    if (!author_user_id) return res.status(400).json({ message: 'Usuario autor requerido' });
    if (!title || !String(title).trim()) return res.status(400).json({ message: 'Titulo requerido' });
    if (!slug || !String(slug).trim()) return res.status(400).json({ message: 'Slug requerido' });
    if (normalizedPrice === null || !Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: 'Ingresa un precio valido' });
    }

    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO post (category_id, author_user_id, title, slug, content, price, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'draft'), $8)
       RETURNING *`,
      [category_id, author_user_id, title, slug, content || null, normalizedPrice, status, published_at || null]
    );

    const accountId = await getAccountId(client, author_user_id);
    await client.query(
      `INSERT INTO transaction (user_id, financial_account_id, amount, currency, status, description)
       VALUES ($1, $2, 0, 'MXN', 'completed', $3)`,
      [author_user_id, accountId, `Publicacion creada: ${title}`]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Post creado', data: rows[0] });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr.message);
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
      `UPDATE post
         SET category_id  = COALESCE($1, category_id),
             title        = COALESCE($2, title),
             slug         = COALESCE($3, slug),
             content      = COALESCE($4, content),
             price        = COALESCE($5, price),
             status       = COALESCE($6, status),
             published_at = COALESCE($7, published_at),
             updated_at   = NOW()
       WHERE id = $8
       RETURNING *`,
      [category_id, title, slug, content, price, status, published_at, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Post no encontrado' });
    res.json({ message: `Post ${req.params.id} actualizado`, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM post WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Post no encontrado' });
    res.json({ message: `Post ${req.params.id} eliminado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
