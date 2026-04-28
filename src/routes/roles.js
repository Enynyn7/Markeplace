const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM role ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM role WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { rows } = await db.query(
      'INSERT INTO role (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json({ message: 'Rol creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM role WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json({ message: `Rol ${req.params.id} eliminado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;