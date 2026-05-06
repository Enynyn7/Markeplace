const express = require('express');
const router = express.Router();
const db = require('../config/db');

async function validateUserIfProvided(userId) {
  if (!userId) return true;

  const userResult = await db.query(
    'SELECT id, status FROM "user" WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) return false;

  const user = userResult.rows[0];
  return String(user.status || '').toLowerCase() === 'active';
}

router.get('/', async (req, res) => {
  try {
    const { active_only } = req.query;

    let query = `
      SELECT
        f.id,
        f.user_id,
        f.question,
        f.answer,
        f.sort_order,
        f.is_active,
        f.updated_at,
        u.email AS author_email,
        p.first_name AS author_first_name,
        p.last_name AS author_last_name
      FROM faq f
      LEFT JOIN "user" u ON u.id = f.user_id
      LEFT JOIN profile p ON p.user_id = f.user_id
    `;

    if (String(active_only || '').toLowerCase() === 'true') {
      query += ' WHERE f.is_active = TRUE';
    }

    query += ' ORDER BY f.sort_order ASC, f.id ASC';

    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('[faqs/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        f.id,
        f.user_id,
        f.question,
        f.answer,
        f.sort_order,
        f.is_active,
        f.updated_at,
        u.email AS author_email,
        p.first_name AS author_first_name,
        p.last_name AS author_last_name
      FROM faq f
      LEFT JOIN "user" u ON u.id = f.user_id
      LEFT JOIN profile p ON p.user_id = f.user_id
      WHERE f.id = $1
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'FAQ no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[faqs/get/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, question, answer, sort_order, is_active } = req.body;

    if (!question || !String(question).trim()) {
      return res.status(400).json({ message: 'La pregunta es obligatoria' });
    }

    if (!answer || !String(answer).trim()) {
      return res.status(400).json({ message: 'La respuesta es obligatoria' });
    }

    const userIsValid = await validateUserIfProvided(user_id);

    if (!userIsValid) {
      return res.status(404).json({ message: 'Usuario autor no encontrado o inactivo' });
    }

    const { rows } = await db.query(
      `
      INSERT INTO faq (user_id, question, answer, sort_order, is_active)
      VALUES ($1, $2, $3, COALESCE($4, 0), COALESCE($5, TRUE))
      RETURNING id, user_id, question, answer, sort_order, is_active, updated_at
      `,
      [
        user_id || null,
        String(question).trim(),
        String(answer).trim(),
        sort_order,
        is_active
      ]
    );

    res.status(201).json({ message: 'FAQ creada', data: rows[0] });
  } catch (err) {
    console.error('[faqs/post]', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { user_id, question, answer, sort_order, is_active } = req.body;

    const userIsValid = await validateUserIfProvided(user_id);

    if (!userIsValid) {
      return res.status(404).json({ message: 'Usuario autor no encontrado o inactivo' });
    }

    const { rows } = await db.query(
      `
      UPDATE faq
         SET user_id    = COALESCE($1, user_id),
             question   = COALESCE($2, question),
             answer     = COALESCE($3, answer),
             sort_order = COALESCE($4, sort_order),
             is_active  = COALESCE($5, is_active),
             updated_at = NOW()
       WHERE id = $6
       RETURNING id, user_id, question, answer, sort_order, is_active, updated_at
      `,
      [
        user_id,
        question ? String(question).trim() : null,
        answer ? String(answer).trim() : null,
        sort_order,
        is_active,
        req.params.id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'FAQ no encontrada' });
    }

    res.json({ message: 'FAQ actualizada', data: rows[0] });
  } catch (err) {
    console.error('[faqs/put/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM faq WHERE id = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'FAQ no encontrada' });
    }

    res.json({ message: 'FAQ eliminada' });
  } catch (err) {
    console.error('[faqs/delete/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
