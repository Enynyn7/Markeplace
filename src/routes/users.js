const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, role_id, email, status, created_at, updated_at FROM "user" ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, role_id, email, status, created_at, updated_at FROM "user" WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { role_id, email, password_hash, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO "user" (role_id, email, password_hash, status)
       VALUES ($1, $2, $3, COALESCE($4, 'active'))
       RETURNING id, role_id, email, status, created_at, updated_at`,
      [role_id, email, password_hash, status]
    );
    res.status(201).json({ message: 'Usuario creado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { role_id, email, password_hash, status } = req.body;
    const { rows } = await db.query(
      `UPDATE "user"
         SET role_id       = COALESCE($1, role_id),
             email         = COALESCE($2, email),
             password_hash = COALESCE($3, password_hash),
             status        = COALESCE($4, status),
             updated_at    = NOW()
       WHERE id = $5
       RETURNING id, role_id, email, status, created_at, updated_at`,
      [role_id, email, password_hash, status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: `Usuario ${req.params.id} actualizado`, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM "user" WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: `Usuario ${req.params.id} eliminado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;