const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns: { user: { id, email, role, status, profile } }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // 1. Buscar usuario con su perfil y rol
    const { rows } = await db.query(
      `SELECT
         u.id,
         u.email,
         u.password_hash,
         u.status,
         u.role_id,
         r.name         AS role_name,
         p.first_name,
         p.last_name,
         p.avatar_url,
         p.phone
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

    // 2. Verificar que la cuenta esté activa
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Cuenta desactivada. Contacta al soporte.' });
    }

    // 3. Verificar contraseña con bcrypt
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptErr) {
      // Si el hash no es bcrypt válido (e.g. seeds de prueba), hacemos comparación de texto plano
      // SOLO para desarrollo — en producción todos los hashes deben ser bcrypt
      console.warn('[auth] Hash no es bcrypt válido, comparando texto plano (solo dev)');
      passwordMatch = (password === user.password_hash);
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 4. Responder con datos del usuario (sin el hash)
    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Login exitoso',
      user: {
        id: safeUser.id,
        email: safeUser.email,
        status: safeUser.status,
        roleId: safeUser.role_id,
        role: safeUser.role_name,
        firstName: safeUser.first_name,
        lastName: safeUser.last_name,
        fullName: [safeUser.first_name, safeUser.last_name].filter(Boolean).join(' ') || safeUser.email,
        avatarUrl: safeUser.avatar_url,
        phone: safeUser.phone,
      },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/register
 * Body: { email, password, firstName, lastName, phone? }
 * Returns: { user: { id, email, role, ... } }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, contraseña, nombre y apellido son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const { rows: existing } = await db.query(
      'SELECT id FROM "user" WHERE email = $1',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo' });
    }

    // Obtener role_id de 'buyer' (role por defecto para nuevos usuarios)
    const { rows: roles } = await db.query("SELECT id FROM role WHERE name = 'buyer' LIMIT 1");
    const roleId = roles.length > 0 ? roles[0].id : 3;

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Insertar usuario
    const { rows: newUser } = await db.query(
      `INSERT INTO "user" (role_id, email, password_hash, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING id, email, role_id, status`,
      [roleId, email, passwordHash]
    );

    const createdUser = newUser[0];

    // Insertar perfil
    await db.query(
      `INSERT INTO profile (user_id, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4)`,
      [createdUser.id, firstName, lastName, phone || null]
    );

    // Insertar cuenta financiera inicial
    await db.query(
      `INSERT INTO financial_account (user_id, account_type, currency, balance)
       VALUES ($1, 'standard', 'MXN', 0.00)`,
      [createdUser.id]
    );

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
      },
    });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/recover-password
 * Body: { email }
 */
router.post('/recover-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    const { rows } = await db.query('SELECT u.id, p.phone FROM "user" u LEFT JOIN profile p ON p.user_id = u.id WHERE u.email = $1', [email]);
    if (rows.length === 0) {
      // Simular éxito para no revelar si el correo existe
      return res.json({ message: 'Si el correo existe, se ha enviado un código de recuperación.' });
    }

    const user = rows[0];
    
    // Aquí iría la lógica de 2FA vía SMS. 
    // Para el sprint, simulamos el envío de SMS.
    console.log(`[auth/recover-password] Simulando envío de SMS al número ${user.phone || 'no registrado'}. Código: 123456`);

    res.json({ 
      message: 'Si el correo existe, se ha enviado un código de recuperación.',
      mockCode: '123456'
    });
  } catch (err) {
    console.error('[auth/recover-password]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/reset-password
 * Body: { email, code, newPassword }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    
    // Validar el código simulado
    if (code !== '123456') {
      return res.status(400).json({ message: 'Código inválido o expirado' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const { rowCount } = await db.query(
      `UPDATE "user" SET password_hash = $1 WHERE email = $2`,
      [passwordHash, email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    console.error('[auth/reset-password]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
