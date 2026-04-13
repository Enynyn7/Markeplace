const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, user_id: 5, issue: "Error en mi pago", status: "abierto" }]));
router.get('/:id', (req, res) => res.json({ id: 1, user_id: 5, issue: "Error en mi pago", status: "abierto" }));
router.post('/', (req, res) => res.status(201).json({ message: "Solicitud enviada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Solicitud actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "Solicitud eliminada" }));
module.exports = router;