const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM post ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM post WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category_id, author_user_id, title, slug, content, status, published_at } = req.body;
    const { rows } = await db.query(
      `INSERT INTO post (category_id, author_user_id, title, slug, content, status, published_at)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'draft'), $7)
       RETURNING *`,
      [category_id, author_user_id, title, slug, content || null, status, published_at || null]
    );
    res.status(201).json({ message: 'Post creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { category_id, title, slug, content, status, published_at } = req.body;
    const { rows } = await db.query(
      `UPDATE post
         SET category_id  = COALESCE($1, category_id),
             title        = COALESCE($2, title),
             slug         = COALESCE($3, slug),
             content      = COALESCE($4, content),
             status       = COALESCE($5, status),
             published_at = COALESCE($6, published_at),
             updated_at   = NOW()
       WHERE id = $7
       RETURNING *`,
      [category_id, title, slug, content, status, published_at, req.params.id]
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