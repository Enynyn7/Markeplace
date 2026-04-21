const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. GET lista de preguntas frecuentes (¡Ya conectada a PostgreSQL!)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faq WHERE is_active = TRUE ORDER BY sort_order ASC');
    res.json({
      message: "Preguntas frecuentes obtenidas correctamente",
      data: result.rows
    });
  } catch (error) {
    console.error("Error al consultar FAQs:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

// ----------------------------------------------------------------------
// Las rutas de aquí abajo siguen siendo Mocks por ahora
// ----------------------------------------------------------------------
router.get('/:id', (req, res) => res.json({ id: 1, question: "¿Cómo pago?", answer: "En la app." }));
router.post('/', (req, res) => res.status(201).json({ message: "FAQ creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "FAQ actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "FAQ eliminada" }));

module.exports = router;