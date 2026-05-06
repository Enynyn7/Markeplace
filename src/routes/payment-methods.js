const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const params = [];
    let query = 'SELECT * FROM payment_method';
    if (user_id) {
      params.push(user_id);
      query += ' WHERE user_id = $1';
    }
    query += ' ORDER BY id';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payment_method WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Método no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, method_type, provider, last4, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO payment_method (user_id, method_type, provider, last4, status) 
       VALUES ($1, $2, $3, $4, COALESCE($5, 'active')) RETURNING *`,
      [user_id, method_type, provider, last4, status]
    );
    res.status(201).json({ message: 'Método guardado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await db.query(
      `UPDATE payment_method SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Método no encontrado' });
    res.json({ message: 'Método actualizado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM payment_method WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Método no encontrado' });
    res.json({ message: 'Método eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
