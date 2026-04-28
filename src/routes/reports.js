const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM report ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM report WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, title, content, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO report (user_id, title, content, status) 
       VALUES ($1, $2, $3, COALESCE($4, 'pending')) RETURNING *`,
      [user_id, title, content, status]
    );
    res.status(201).json({ message: 'Reporte creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await db.query(
      `UPDATE report SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.json({ message: 'Reporte actualizado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM report WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.json({ message: 'Reporte eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;