const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ticket_payment_evidence ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ticket_payment_evidence WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Evidencia no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ticket_sale_id, evidence_type, file_url, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ticket_payment_evidence (ticket_sale_id, evidence_type, file_url, status) 
       VALUES ($1, $2, $3, COALESCE($4, 'pending')) RETURNING *`,
      [ticket_sale_id, evidence_type, file_url, status]
    );
    res.status(201).json({ message: 'Evidencia subida', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM ticket_payment_evidence WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Evidencia no encontrada' });
    res.json({ message: 'Evidencia eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;