const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM post_image ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM post_image WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { post_id, url, alt_text, sort_order } = req.body;
    const { rows } = await db.query(
      `INSERT INTO post_image (post_id, url, alt_text, sort_order) 
       VALUES ($1, $2, $3, COALESCE($4, 0)) RETURNING *`,
      [post_id, url, alt_text, sort_order]
    );
    res.status(201).json({ message: 'Imagen subida', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { url, alt_text, sort_order } = req.body;
    const { rows } = await db.query(
      `UPDATE post_image SET 
        url = COALESCE($1, url),
        alt_text = COALESCE($2, alt_text),
        sort_order = COALESCE($3, sort_order)
       WHERE id = $4 RETURNING *`,
      [url, alt_text, sort_order, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json({ message: 'Imagen actualizada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM post_image WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;