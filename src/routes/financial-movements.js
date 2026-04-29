const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
    if (rows.length === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, financial_account_id, amount, description } = req.body;
    const { rows } = await db.query(
      `INSERT INTO transaction (user_id, financial_account_id, amount, description) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, financial_account_id, amount, description]
    );
    res.status(201).json({ message: 'Movimiento registrado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM transaction WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json({ message: `Movimiento ${req.params.id} eliminado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;