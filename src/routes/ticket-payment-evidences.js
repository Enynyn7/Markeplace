const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, ticket_id: 4, file_url: "comprobante.pdf" }]));
router.get('/:id', (req, res) => res.json({ id: 1, ticket_id: 4, file_url: "comprobante.pdf" }));
router.post('/', (req, res) => res.status(201).json({ message: "Evidencia subida", data: req.body }));
router.delete('/:id', (req, res) => res.json({ message: "Evidencia eliminada" }));
module.exports = router;