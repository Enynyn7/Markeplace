const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ticket_sale ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ticket_sale WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ticket_id, buyer_user_id, price, currency, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ticket_sale (ticket_id, buyer_user_id, price, currency, status)
       VALUES ($1, $2, $3, COALESCE($4, 'MXN'), COALESCE($5, 'pending'))
       RETURNING *`,
      [ticket_id, buyer_user_id, price, currency, status]
    );
    res.status(201).json({ message: 'Venta registrada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { ticket_id, buyer_user_id, price, currency, status } = req.body;
    const { rows } = await db.query(
      `UPDATE ticket_sale
         SET ticket_id     = COALESCE($1, ticket_id),
             buyer_user_id = COALESCE($2, buyer_user_id),
             price         = COALESCE($3, price),
             currency      = COALESCE($4, currency),
             status        = COALESCE($5, status),
             updated_at    = NOW()
       WHERE id = $6
       RETURNING *`,
      [ticket_id, buyer_user_id, price, currency, status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json({ message: `Venta ${req.params.id} actualizada`, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM ticket_sale WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json({ message: `Venta ${req.params.id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;