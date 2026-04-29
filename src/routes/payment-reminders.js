const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payment_reminder ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payment_reminder WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ticket_sale_id, reminder_at, status, channel } = req.body;
    const { rows } = await db.query(
      `INSERT INTO payment_reminder (ticket_sale_id, reminder_at, status, channel) 
       VALUES ($1, $2, COALESCE($3, 'pending'), COALESCE($4, 'email')) RETURNING *`,
      [ticket_sale_id, reminder_at, status, channel]
    );
    res.status(201).json({ message: 'Recordatorio creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM payment_reminder WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json({ message: 'Recordatorio eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;