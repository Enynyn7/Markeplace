const express = require('express');
const router = express.Router();
const db = require('../config/db');


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
async function getUserAccess(userId) {
  const { rows } = await db.query(
    `
    SELECT
      u.id,
      u.email,
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

function canManageTickets(user) {
  const role = String(user?.role_name || '').toLowerCase();
  const userType = String(user?.user_type || '').toLowerCase();

  return userType === 'student' || role === 'admin' || role === 'staff';
}

async function listTicketsByUser(userId) {
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
      CONCAT(bp.first_name, ' ', bp.last_name) AS nombre_comprador,
      ts.evidence_url AS evidencia_pago_url,
      ts.evidence_status AS estado_evidencia,
      p.id AS linked_post_id,
      p.title AS linked_post_title
    FROM lottery_ticket lt
    LEFT JOIN ticket_sale ts ON ts.ticket_id = lt.id
    LEFT JOIN profile bp ON bp.user_id = ts.buyer_user_id
    LEFT JOIN post p ON p.ticket_id = lt.id
    WHERE lt.user_id = $1
    ORDER BY lt.id DESC
    `,
    [userId]
  );

  return rows;
}

/*
  IMPORTANTE:
  Esta ruta va antes de /:id.
  Si /:id va primero, Express interpreta "available" como id.
*/
router.get('/available', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id es obligatorio' });
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
    console.error('[tickets/available]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (user_id) {
      const tickets = await listTicketsByUser(user_id);
      return res.json(tickets);
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
        lt.updated_at
      FROM lottery_ticket lt
      ORDER BY lt.id DESC
      `
    );

    res.json(rows);
  } catch (err) {
    console.error('[tickets/get]', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
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
        p.id AS linked_post_id,
        p.title AS linked_post_title
      FROM lottery_ticket lt
      LEFT JOIN post p ON p.ticket_id = lt.id
      WHERE lt.id = $1
      `,
      [req.params.id]
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

    if (!user_id || !event_id || !(folio || subject)) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: user_id, event_id y folio'
      });
    }

    const user = await getUserAccess(user_id);

    if (!user || String(user.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    if (!canManageTickets(user)) {
      return res.status(403).json({
        message: 'Solo estudiantes, staff o admin pueden crear boletos'
      });
    }

    const cleanStatus = String(status || 'available').toLowerCase();

    if (!['available', 'reserved', 'sold', 'cancelled'].includes(cleanStatus)) {
      return res.status(400).json({
        message: 'Status inválido. Usa available, reserved, sold o cancelled'
      });
    }

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
      [
        user_id,
        event_id,
        String(folio || subject).trim(),
        description || '',
        cleanStatus
      ]
    );

    res.status(201).json({
      message: 'Boleto creado',
      data: rows[0]
    });
  } catch (err) {
    console.error('[tickets/post]', err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;


