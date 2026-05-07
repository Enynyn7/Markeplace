const express = require('express');
const router = express.Router();
const db = require('../config/db');

const VALID_STATUSES = ['open', 'pending', 'in_progress', 'resolved', 'closed'];

function normalizeStatus(status) {
  return String(status || 'open').toLowerCase();
}

router.get('/', async (req, res) => {
  try {
    const { user_id, status } = req.query;

    const params = [];
    const filters = [];

    let query = `
      SELECT
        sr.id,
        sr.user_id,
        sr.subject,
        sr.message,
        sr.status,
        sr.created_at,
        u.email AS user_email,
        p.first_name,
        p.last_name
      FROM support_request sr
      INNER JOIN "user" u ON u.id = sr.user_id
      LEFT JOIN profile p ON p.user_id = sr.user_id
    `;

    if (user_id) {
      params.push(user_id);
      filters.push(`sr.user_id = $${params.length}`);
    }

    if (status) {
      params.push(String(status).toLowerCase());
      filters.push(`LOWER(sr.status) = $${params.length}`);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(' AND ')}`;
    }

    query += ' ORDER BY sr.created_at DESC, sr.id DESC';

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('[support-requests/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        sr.id,
        sr.user_id,
        sr.subject,
        sr.message,
        sr.status,
        sr.created_at,
        u.email AS user_email,
        p.first_name,
        p.last_name
      FROM support_request sr
      INNER JOIN "user" u ON u.id = sr.user_id
      LEFT JOIN profile p ON p.user_id = sr.user_id
      WHERE sr.id = $1
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[support-requests/get/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, subject, message, status } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id es obligatorio' });
    }

    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ message: 'El asunto es obligatorio' });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: 'El mensaje es obligatorio' });
    }

    const normalizedStatus = normalizeStatus(status);

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Status inválido. Usa uno de: ${VALID_STATUSES.join(', ')}`
      });
    }

    const userResult = await db.query(
      'SELECT id, status FROM "user" WHERE id = $1',
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    const foundUser = userResult.rows[0];

    if (String(foundUser.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    const { rows } = await db.query(
      `
      INSERT INTO support_request (user_id, subject, message, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, subject, message, status, created_at
      `,
      [user_id, String(subject).trim(), String(message).trim(), normalizedStatus]
    );

    res.status(201).json({ message: 'Solicitud enviada', data: rows[0] });
  } catch (err) {
    console.error('[support-requests/post]', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status es obligatorio' });
    }

    const normalizedStatus = normalizeStatus(status);

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Status inválido. Usa uno de: ${VALID_STATUSES.join(', ')}`
      });
    }

    const { rows } = await db.query(
      `
      UPDATE support_request
         SET status = $1
       WHERE id = $2
       RETURNING id, user_id, subject, message, status, created_at
      `,
      [normalizedStatus, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json({ message: 'Solicitud actualizada', data: rows[0] });
  } catch (err) {
    console.error('[support-requests/put]', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM support_request WHERE id = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json({ message: 'Solicitud eliminada' });
  } catch (err) {
    console.error('[support-requests/delete]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
