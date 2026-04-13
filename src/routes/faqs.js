const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, question: "¿Cómo pago?", answer: "En la app." }]));
router.get('/:id', (req, res) => res.json({ id: 1, question: "¿Cómo pago?", answer: "En la app." }));
router.post('/', (req, res) => res.status(201).json({ message: "FAQ creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "FAQ actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "FAQ eliminada" }));
module.exports = router;