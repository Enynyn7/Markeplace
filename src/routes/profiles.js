const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM profile ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM profile WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, first_name, last_name, avatar_url, phone } = req.body;
    const { rows } = await db.query(
      `INSERT INTO profile (user_id, first_name, last_name, avatar_url, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, first_name || null, last_name || null, avatar_url || null, phone || null]
    );
    res.status(201).json({ message: 'Perfil creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, avatar_url, phone } = req.body;
    const { rows } = await db.query(
      `UPDATE profile
         SET first_name = COALESCE($1, first_name),
             last_name  = COALESCE($2, last_name),
             avatar_url = COALESCE($3, avatar_url),
             phone      = COALESCE($4, phone),
             updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [first_name, last_name, avatar_url, phone, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json({ message: 'Perfil actualizado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM profile WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json({ message: 'Perfil eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;