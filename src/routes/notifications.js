const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = 'SELECT * FROM notification';
    let params = [];
    if (user_id) {
      query += ' WHERE user_id = $1';
      params.push(user_id);
    }
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM notification WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, type, title, message, is_read } = req.body;
    const { rows } = await db.query(
      `INSERT INTO notification (user_id, type, title, message, is_read)
       VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
       RETURNING *`,
      [user_id, type, title, message || null, is_read]
    );
    res.status(201).json({ message: 'Notificación creada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { type, title, message, is_read } = req.body;
    const { rows } = await db.query(
      `UPDATE notification
         SET type    = COALESCE($1, type),
             title   = COALESCE($2, title),
             message = COALESCE($3, message),
             is_read = COALESCE($4, is_read)
       WHERE id = $5
       RETURNING *`,
      [type, title, message, is_read, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json({ message: 'Notificación actualizada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM notification WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;