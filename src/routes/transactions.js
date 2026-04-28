const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM transaction ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM transaction WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Transacción no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      user_id, payment_method_id, financial_account_id,
      amount, currency, status, description
    } = req.body;
    const { rows } = await db.query(
      `INSERT INTO transaction
         (user_id, payment_method_id, financial_account_id, amount, currency, status, description)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'MXN'), COALESCE($6, 'pending'), $7)
       RETURNING *`,
      [user_id, payment_method_id || null, financial_account_id || null,
       amount, currency, status, description || null]
    );
    res.status(201).json({ message: 'Transacción registrada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM transaction WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Transacción no encontrada' });
    res.json({ message: `Transacción ${req.params.id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;