const express = require('express');
const router = express.Router();
const db = require('../config/db');

const VALID_TICKET_STATUSES = ['available', 'sold', 'reserved', 'cancelled'];

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

  if (rows.length === 0) return null;
  return rows[0];
}

function canManageTickets(user) {
  if (!user) return false;

  const role = String(user.role_name || '').toLowerCase();
  const userType = String(user.user_type || '').toLowerCase();

  return role === 'admin' || role === 'staff' || userType === 'student';
}

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = `
      SELECT DISTINCT ON (lt.id)
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
        p.first_name || ' ' || p.last_name AS nombre_comprador,
        tpe.file_url AS evidencia_pago_url,
        tpe.status AS estado_evidencia
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON lt.id = ts.ticket_id
      LEFT JOIN profile p ON ts.buyer_user_id = p.user_id
      LEFT JOIN ticket_payment_evidence tpe ON ts.id = tpe.ticket_sale_id
    `;

    const params = [];

    if (user_id) {
      params.push(user_id);
      query += ' WHERE lt.user_id = $1 ';
    }

    query += `
      ORDER BY lt.id, ts.created_at DESC NULLS LAST;
    `;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar los boletos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;

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
        p.first_name || ' ' || p.last_name AS nombre_comprador,
        tpe.file_url AS evidencia_pago_url,
        tpe.status AS estado_evidencia
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON lt.id = ts.ticket_id
      LEFT JOIN profile p ON ts.buyer_user_id = p.user_id
      LEFT JOIN ticket_payment_evidence tpe ON ts.id = tpe.ticket_sale_id
      WHERE lt.id = $1
      ORDER BY ts.created_at DESC NULLS LAST
      LIMIT 1;
      `,
      [ticketId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar el boleto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, event_id, folio, subject, description, status } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({ message: 'user_id y event_id son obligatorios' });
    }

    const ticketSubject = String(folio || subject || '').trim();

    if (!ticketSubject) {
      return res.status(400).json({ message: 'folio o subject es obligatorio' });
    }

    const normalizedStatus = String(status || 'available').toLowerCase();

    if (!VALID_TICKET_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Estado inválido. Usa uno de: ${VALID_TICKET_STATUSES.join(', ')}`
      });
    }

    const user = await getUserAccess(user_id);

    if (!user || String(user.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    if (!canManageTickets(user)) {
      return res.status(403).json({
        message: 'Solo estudiantes, staff o admin pueden gestionar boletos'
      });
    }

    const eventResult = await db.query(
      'SELECT id FROM event WHERE id = $1',
      [event_id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
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
        updated_at;
      `,
      [
        user_id,
        event_id,
        ticketSubject,
        description || null,
        normalizedStatus
      ]
    );

    res.status(201).json({
      message: 'Boleto creado',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al crear boleto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { user_id, folio, subject, description, status } = req.body;

    const ticketResult = await db.query(
      'SELECT id, user_id, status FROM lottery_ticket WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const ticket = ticketResult.rows[0];
    const actorId = user_id || ticket.user_id;
    const user = await getUserAccess(actorId);

    if (!user || String(user.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    const role = String(user.role_name || '').toLowerCase();

    if (!canManageTickets(user)) {
      return res.status(403).json({ message: 'No tienes permiso para modificar boletos' });
    }

    if (role !== 'admin' && role !== 'staff' && Number(ticket.user_id) !== Number(actorId)) {
      return res.status(403).json({ message: 'No puedes modificar boletos de otro usuario' });
    }

    const ticketSubject = String(folio || subject || '').trim() || null;
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
        updated_at;
      `,
      [ticketSubject, description || null, normalizedStatus, ticketId]
    );

    res.json({
      message: 'Boleto actualizado',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar boleto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id es obligatorio para eliminar' });
    }

    const ticketResult = await db.query(
      `
      SELECT 
        lt.id,
        lt.user_id,
        lt.status,
        ts.id AS ticket_sale_id
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON ts.ticket_id = lt.id
      WHERE lt.id = $1
      LIMIT 1
      `,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const ticket = ticketResult.rows[0];
    const user = await getUserAccess(user_id);

    if (!user || String(user.status || '').toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    const role = String(user.role_name || '').toLowerCase();

    if (!canManageTickets(user)) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar boletos' });
    }

    if (role !== 'admin' && role !== 'staff' && Number(ticket.user_id) !== Number(user_id)) {
      return res.status(403).json({ message: 'No puedes eliminar boletos de otro usuario' });
    }

    if (ticket.ticket_sale_id) {
      return res.status(400).json({ message: 'No se puede eliminar un boleto con venta registrada' });
    }

    await db.query('DELETE FROM lottery_ticket WHERE id = $1', [ticketId]);

    res.json({ message: 'Boleto eliminado', ticket_id: Number(ticketId) });
  } catch (error) {
    console.error('Error al eliminar boleto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
