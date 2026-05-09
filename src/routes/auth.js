const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

const VALID_USER_TYPES = ['student', 'external'];

function normalizeUserType(value) {
  return String(value || 'external').toLowerCase()
}

function inferUserTypeFromEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  return normalizedEmail.endsWith('@udlap.mx') ? 'student' : 'external'
}

async function createStudentTickets(client, userId, count = 30) {
  const { rows: events } = await client.query(
    'SELECT id FROM event ORDER BY id LIMIT 1'
  );

  if (events.length === 0) {
    throw new Error('No hay eventos registrados en el sistema para asignar boletos');
  }

  const eventId = events[0].id;

  const values = [];
  const placeholders = [];

  for (let i = 1; i <= count; i++) {
    const folio = `UDLAP-${userId}-${String(i).padStart(3, '0')}`;
    const base = (i - 1) * 3;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    values.push(userId, eventId, folio);
  }

  await client.query(
    `INSERT INTO lottery_ticket (user_id, event_id, subject)
     VALUES ${placeholders.join(', ')}`,
    values
  );
}

async function generateUniqueStudentId(client) {
  let candidate;
  let exists = true;
  while (exists) {
    const digits = String(Math.floor(Math.random() * 100_000_000)).padStart(8, '0');
    candidate = `UDLAP${digits}`;
    const { rows } = await client.query(
      'SELECT 1 FROM profile WHERE student_id = $1',
      [candidate]
    );
    exists = rows.length > 0;
  }
  return candidate;
}

function normalizeScholarship(value, userType) {
  if (userType !== 'student') return 0;

  const numeric = Number(value ?? 0);

  if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
    return null;
  }

  return numeric;
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const { rows } = await db.query(
      `SELECT
         u.id,
         u.email,
         u.password_hash,
         u.status,
         u.role_id,
         r.name AS role_name,
         p.first_name,
         p.last_name,
         p.avatar_url,
         p.phone,
         p.user_type,
         p.student_id,
         p.scholarship_percent
       FROM "user" u
       JOIN role r ON r.id = u.role_id
       LEFT JOIN profile p ON p.user_id = u.id
       WHERE u.email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    if (String(user.status).toLowerCase() !== 'active') {
      return res.status(403).json({ message: 'Cuenta desactivada. Contacta al soporte.' });
    }

    let passwordMatch = false;

    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptErr) {
      console.warn('[auth/login] Hash no bcrypt detectado. Comparación texto plano solo para datos semilla.');
      passwordMatch = password === user.password_hash;
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        roleId: user.role_id,
        role: user.role_name,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        avatarUrl: user.avatar_url,
        phone: user.phone,
        userType: user.user_type || 'external',
        studentId: user.student_id || null,
        scholarshipPercent: Number(user.scholarship_percent || 0),
      },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      userType,
      studentId,
      scholarshipPercent
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, contraseña, nombre y apellido son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const normalizedUserType = inferUserTypeFromEmail(email);

    if (!normalizedUserType) {
      return res.status(400).json({ message: 'Tipo de usuario inválido. Usa student o external.' });
    }

    const normalizedScholarship = normalizedUserType === 'student' ? 50 : 0;

    const { rows: existing } = await db.query(
      'SELECT id FROM "user" WHERE email = $1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo' });
    }

    const { rows: roles } = await db.query("SELECT id FROM role WHERE name = 'buyer' LIMIT 1");
    const roleId = roles.length > 0 ? roles[0].id : 3;

    const passwordHash = await bcrypt.hash(password, 12);

    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const normalizedStudentId = normalizedUserType === 'student'
        ? await generateUniqueStudentId(client)
        : null;

      const { rows: newUser } = await client.query(
        `INSERT INTO "user" (role_id, email, password_hash, status)
         VALUES ($1, $2, $3, 'active')
         RETURNING id, email, role_id, status`,
        [roleId, email, passwordHash]
      );

      const createdUser = newUser[0];

      await client.query(
        `INSERT INTO profile (
           user_id,
           first_name,
           last_name,
           phone,
           user_type,
           student_id,
           scholarship_percent
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          createdUser.id,
          firstName,
          lastName,
          phone || null,
          normalizedUserType,
          normalizedStudentId,
          normalizedScholarship
        ]
      );

      await client.query(
        `INSERT INTO financial_account (user_id, account_type, currency, balance)
         VALUES ($1, 'wallet', 'MXN', 0.00)`,
        [createdUser.id]
      );

      if (normalizedUserType === 'student') {
        await createStudentTickets(client, createdUser.id);
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Cuenta creada exitosamente',
        user: {
          id: createdUser.id,
          email: createdUser.email,
          status: createdUser.status,
          roleId: createdUser.role_id,
          role: 'buyer',
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          avatarUrl: null,
          phone: phone || null,
          userType: normalizedUserType,
          studentId: normalizedStudentId,
          scholarshipPercent: normalizedScholarship,
          ticketsAsignados: normalizedUserType === 'student' ? 30 : 0,
        },
      });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/recover-password', async (req, res) => {
  return res.status(501).json({
    message: 'Recuperación de contraseña no configurada. Falta integrar un proveedor real de correo o SMS.'
  });
});

router.post('/reset-password', async (req, res) => {
  return res.status(501).json({
    message: 'Reset de contraseña no configurado. Falta integrar tokens reales de recuperación.'
  });
});

module.exports = router;

