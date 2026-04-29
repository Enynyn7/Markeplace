const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM support_request ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM support_request WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, subject, message, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO support_request (user_id, subject, message, status) 
       VALUES ($1, $2, $3, COALESCE($4, 'open')) RETURNING *`,
      [user_id, subject, message, status]
    );
    res.status(201).json({ message: 'Solicitud enviada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await db.query(
      `UPDATE support_request SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json({ message: 'Solicitud actualizada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM support_request WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json({ message: 'Solicitud eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;