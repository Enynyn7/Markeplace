const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM purchase_order ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM purchase_order WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, status, total_amount, currency } = req.body;
    const { rows } = await db.query(
      `INSERT INTO purchase_order (user_id, status, total_amount, currency)
       VALUES ($1, COALESCE($2, 'pending'), $3, COALESCE($4, 'MXN'))
       RETURNING *`,
      [user_id, status, total_amount, currency]
    );
    res.status(201).json({ message: 'Orden creada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { user_id, status, total_amount, currency } = req.body;
    const { rows } = await db.query(
      `UPDATE purchase_order
         SET user_id      = COALESCE($1, user_id),
             status       = COALESCE($2, status),
             total_amount = COALESCE($3, total_amount),
             currency     = COALESCE($4, currency),
             updated_at   = NOW()
       WHERE id = $5
       RETURNING *`,
      [user_id, status, total_amount, currency, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: `Orden ${req.params.id} actualizada`, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM purchase_order WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: `Orden ${req.params.id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;