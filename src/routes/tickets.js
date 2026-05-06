const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 1. Conectamos la base de datos

// 2. GET Detalle individual de boleto (HU5 - ¡Conectado a PostgreSQL!)
router.get('/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    // Consulta SQL con JOINs para traer folio, comprador, estado y evidencia
    const query = `
      SELECT 
        lt.id AS ticket_id,
        lt.subject AS folio,
        lt.status AS estado_boleto,
        ts.status AS estado_venta,
        p.first_name || ' ' || p.last_name AS nombre_comprador,
        tpe.file_url AS evidencia_pago_url,
        tpe.status AS estado_evidencia
      FROM lottery_ticket lt
      LEFT JOIN ticket_sale ts ON lt.id = ts.ticket_id
      LEFT JOIN profile p ON ts.buyer_user_id = p.user_id
      LEFT JOIN ticket_payment_evidence tpe ON ts.id = tpe.ticket_sale_id
      WHERE lt.id = $1;
    `;
    
    const result = await db.query(query, [ticketId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Boleto no encontrado" });
    }

    res.json({
      message: "Detalle de boleto obtenido correctamente",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error al consultar el boleto:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

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
      ORDER BY lt.id, tpe.submitted_at DESC NULLS LAST, ts.updated_at DESC NULLS LAST
    `;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar los boletos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/', (req, res) => res.status(201).json({ message: 'Ticket asignado', data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Ticket ${req.params.id} actualizado` }));
router.delete('/:id', (req, res) => res.json({ message: `Ticket ${req.params.id} eliminado` }));

module.exports = router;