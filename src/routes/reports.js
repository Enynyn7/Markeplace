const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, reporter_id: 2, post_id: 10, reason: "Fraude" }]));
router.get('/:id', (req, res) => res.json({ id: 1, reporter_id: 2, post_id: 10, reason: "Fraude" }));
router.post('/', (req, res) => res.status(201).json({ message: "Reporte creado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Reporte actualizado" }));
router.delete('/:id', (req, res) => res.json({ message: "Reporte eliminado" }));
module.exports = router;