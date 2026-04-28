const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM category ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM category WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const { rows } = await db.query(
      `INSERT INTO category (name, slug, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, slug, description || null]
    );
    res.status(201).json({ message: 'Categoría creada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const { rows } = await db.query(
      `UPDATE category
         SET name        = COALESCE($1, name),
             slug        = COALESCE($2, slug),
             description = COALESCE($3, description),
             updated_at  = NOW()
       WHERE id = $4
       RETURNING *`,
      [name, slug, description, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría actualizada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM category WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;