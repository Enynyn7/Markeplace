const express = require('express');
const router = express.Router();
const db = require('../config/db');

const VALID_USER_TYPES = ['student', 'external'];

function normalizeUserType(value) {
  const normalized = String(value || 'external').toLowerCase().trim();
  return VALID_USER_TYPES.includes(normalized) ? normalized : null;
}

function normalizeScholarship(value, userType) {
  if (userType !== 'student') return 0;

  const numeric = Number(value ?? 0);

  if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
    return null;
  }

  return numeric;
}

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = `
      SELECT
        p.id,
        p.user_id,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.phone,
        p.user_type,
        p.student_id,
        p.scholarship_percent,
        p.created_at,
        p.updated_at,
        u.email,
        u.status,
        r.name AS role_name
      FROM profile p
      JOIN "user" u ON u.id = p.user_id
      JOIN role r ON r.id = u.role_id
    `;

    const params = [];

    if (user_id) {
      query += ' WHERE p.user_id = $1';
      params.push(user_id);
    }

    query += ' ORDER BY p.id';

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('[profiles/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        p.id,
        p.user_id,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.phone,
        p.user_type,
        p.student_id,
        p.scholarship_percent,
        p.created_at,
        p.updated_at,
        u.email,
        u.status,
        r.name AS role_name
      FROM profile p
      JOIN "user" u ON u.id = p.user_id
      JOIN role r ON r.id = u.role_id
      WHERE p.user_id = $1
      `,
      [req.params.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[profiles/get/user/:userId]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        p.id,
        p.user_id,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.phone,
        p.user_type,
        p.student_id,
        p.scholarship_percent,
        p.created_at,
        p.updated_at,
        u.email,
        u.status,
        r.name AS role_name
      FROM profile p
      JOIN "user" u ON u.id = p.user_id
      JOIN role r ON r.id = u.role_id
      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[profiles/get/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      avatar_url,
      phone,
      user_type,
      student_id,
      scholarship_percent
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id es obligatorio' });
    }

    const normalizedUserType = normalizeUserType(user_type);

    if (!normalizedUserType) {
      return res.status(400).json({ message: 'Tipo de usuario inválido. Usa student o external.' });
    }

    const normalizedScholarship = normalizeScholarship(scholarship_percent, normalizedUserType);

    if (normalizedScholarship === null) {
      return res.status(400).json({ message: 'La beca debe estar entre 0 y 100.' });
    }

    const normalizedStudentId = normalizedUserType === 'student'
      ? String(student_id || '').trim() || null
      : null;

    const userResult = await db.query(
      'SELECT id, status FROM "user" WHERE id = $1',
      [user_id]
    );

    if (userResult.rows.length === 0 || String(userResult.rows[0].status).toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    const { rows } = await db.query(
      `INSERT INTO profile (
         user_id,
         first_name,
         last_name,
         avatar_url,
         phone,
         user_type,
         student_id,
         scholarship_percent
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id,
        first_name || null,
        last_name || null,
        avatar_url || null,
        phone || null,
        normalizedUserType,
        normalizedStudentId,
        normalizedScholarship
      ]
    );

    res.status(201).json({ message: 'Perfil creado', data: rows[0] });
  } catch (err) {
    console.error('[profiles/post]', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      avatar_url,
      phone,
      user_type,
      student_id,
      scholarship_percent
    } = req.body;

    let normalizedUserType = null;
    let normalizedScholarship = null;
    let normalizedStudentId = null;

    if (user_type !== undefined) {
      normalizedUserType = normalizeUserType(user_type);

      if (!normalizedUserType) {
        return res.status(400).json({ message: 'Tipo de usuario inválido. Usa student o external.' });
      }

      normalizedScholarship = normalizeScholarship(scholarship_percent, normalizedUserType);

      if (normalizedScholarship === null) {
        return res.status(400).json({ message: 'La beca debe estar entre 0 y 100.' });
      }

      normalizedStudentId = normalizedUserType === 'student'
        ? String(student_id || '').trim() || null
        : null;
    }

    const { rows } = await db.query(
      `UPDATE profile
         SET first_name = COALESCE($1, first_name),
             last_name  = COALESCE($2, last_name),
             avatar_url = COALESCE($3, avatar_url),
             phone      = COALESCE($4, phone),
             user_type  = COALESCE($5, user_type),
             student_id = CASE
                            WHEN $5 = 'external' THEN NULL
                            ELSE COALESCE($6, student_id)
                          END,
             scholarship_percent = CASE
                                      WHEN $5 = 'external' THEN 0
                                      ELSE COALESCE($7, scholarship_percent)
                                    END,
             updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        first_name,
        last_name,
        avatar_url,
        phone,
        normalizedUserType,
        normalizedStudentId,
        normalizedScholarship,
        req.params.id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado', data: rows[0] });
  } catch (err) {
    console.error('[profiles/put/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM profile WHERE id = $1', [req.params.id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil eliminado' });
  } catch (err) {
    console.error('[profiles/delete/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
