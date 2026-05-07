const express = require('express');
const router = express.Router();
const db = require('../config/db');

const VALID_TICKET_STATUSES = ['available', 'listed', 'sold', 'cancelled'];

async function getUserAccess(userId) {
  const { rows } = await db.query(
    `
    SELECT
      u.id,
      u.status,
      r.name AS role_name,
      p.user_type
    FROM "user" u
    LEFT JOIN role r ON r.id = u.role_id
    LEFT JOIN profile p ON p.user_id = u.id
    WHERE u.id = $1
    `,
    [userId]
  );

  return rows[0] || null;
}

function canManageTickets(userAccess) {
  if (!userAccess) return false;

  const role = String(userAccess.role_name || '').toLowerCase();
  const userType = String(userAccess.user_type || '').toLowerCase();

  return role === 'admin' || role === 'staff' || userType === 'student';
}

router.get('/user/:user_id/available', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { rows } = await db.query(
      `
      SELECT
        lt.id AS ticket_id,
        lt.user_id,
        lt.event_id,
        lt.subject AS folio,
        lt.description,
        lt.status AS estado_boleto,
        lt.created_at,
        lt.updated_at
      FROM lottery_ticket lt
      LEFT JOIN post p ON p.ticket_id = lt.id
      WHERE lt.user_id = $1
        AND lt.status = 'available'
        AND p.id IS NULL
      ORDER BY lt.id DESC
      `,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('[tickets/user/:user_id/available]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    const values = [];
    let whereClause = '';

    if (user_id) {
      values.push(user_id);
      whereClause = 'WHERE lt.user_id = $1';
    }

    const { rows } = await db.query(
      `
      SELECT
        lt.id AS ticket_id,
        lt.user_id,
        lt.event_id,
        lt.subject AS folio,
        lt.description,
        lt.status AS estado_boleto,
        lt.created_at,
        lt.updated_at,

        ts.id AS ticket_sale_id,
        ts.buyer_user_id,
        ts.price,
        ts.currency,
        ts.status AS estado_venta,

        NULLIF(TRIM(CONCAT(bp.first_name, ' ', bp.last_name)), '') AS nombre_comprador,

        tpe.file_url AS evidencia_pago_url,
        tpe.status AS estado_evidencia
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON ts.ticket_id = lt.id
      LEFT JOIN profile bp ON bp.user_id = ts.buyer_user_id
      LEFT JOIN ticket_payment_evidence tpe ON tpe.ticket_sale_id = ts.id
      ${whereClause}
      ORDER BY lt.id DESC
      `,
      values
    );

    res.json(rows);
  } catch (err) {
    console.error('[tickets/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(
      `
      SELECT
        lt.id AS ticket_id,
        lt.user_id,
        lt.event_id,
        lt.subject AS folio,
        lt.description,
        lt.status AS estado_boleto,
        lt.created_at,
        lt.updated_at,

        ts.id AS ticket_sale_id,
        ts.buyer_user_id,
        ts.price,
        ts.currency,
        ts.status AS estado_venta,

        NULLIF(TRIM(CONCAT(bp.first_name, ' ', bp.last_name)), '') AS nombre_comprador,

        tpe.file_url AS evidencia_pago_url,
        tpe.status AS estado_evidencia
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON ts.ticket_id = lt.id
      LEFT JOIN profile bp ON bp.user_id = ts.buyer_user_id
      LEFT JOIN ticket_payment_evidence tpe ON tpe.ticket_sale_id = ts.id
      WHERE lt.id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[tickets/get/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      event_id,
      folio,
      subject,
      description,
      status = 'available'
    } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({ message: 'user_id y event_id son obligatorios' });
    }

    const normalizedStatus = String(status || 'available').toLowerCase();

    if (!VALID_TICKET_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Estado inválido. Usa uno de: ${VALID_TICKET_STATUSES.join(', ')}`
      });
    }

    const userAccess = await getUserAccess(user_id);

    if (!userAccess || String(userAccess.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    if (!canManageTickets(userAccess)) {
      return res.status(403).json({
        message: 'Solo estudiantes, staff o admin pueden gestionar boletos'
      });
    }

    const finalFolio = subject || folio || `BOLETO-${Date.now()}`;

    const { rows } = await db.query(
      `
      INSERT INTO lottery_ticket (user_id, event_id, subject, description, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id AS ticket_id,
        user_id,
        event_id,
        subject AS folio,
        description,
        status AS estado_boleto,
        created_at,
        updated_at
      `,
      [user_id, event_id, finalFolio, description || null, normalizedStatus]
    );

    res.status(201).json({ message: 'Boleto creado', data: rows[0] });
  } catch (err) {
    console.error('[tickets/post]', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      folio,
      subject,
      description,
      status
    } = req.body;

    const normalizedStatus = status ? String(status).toLowerCase() : null;

    if (normalizedStatus && !VALID_TICKET_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Estado inválido. Usa uno de: ${VALID_TICKET_STATUSES.join(', ')}`
      });
    }

    const { rows } = await db.query(
      `
      UPDATE lottery_ticket
      SET
        subject = COALESCE($1, subject),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id AS ticket_id,
        user_id,
        event_id,
        subject AS folio,
        description,
        status AS estado_boleto,
        created_at,
        updated_at
      `,
      [subject || folio || null, description || null, normalizedStatus, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    res.json({ message: 'Boleto actualizado', data: rows[0] });
  } catch (err) {
    console.error('[tickets/put/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
