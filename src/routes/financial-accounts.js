const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM financial_account ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM financial_account WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, account_type, currency, balance } = req.body;
    const { rows } = await db.query(
      `INSERT INTO financial_account (user_id, account_type, currency, balance) 
       VALUES ($1, $2, COALESCE($3, 'MXN'), COALESCE($4, 0.00)) RETURNING *`,
      [user_id, account_type, currency, balance]
    );
    res.status(201).json({ message: 'Cuenta creada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { account_type, currency, balance } = req.body;
    const { rows } = await db.query(
      `UPDATE financial_account SET 
        account_type = COALESCE($1, account_type),
        currency = COALESCE($2, currency),
        balance = COALESCE($3, balance),
        updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [account_type, currency, balance, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json({ message: 'Cuenta actualizada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM financial_account WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json({ message: 'Cuenta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;