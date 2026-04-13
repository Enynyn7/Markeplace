const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, user_id: 2, amount_due: 500, due_date: "2026-05-15" }]));
router.get('/:id', (req, res) => res.json({ id: 1, user_id: 2, amount_due: 500, due_date: "2026-05-15" }));
router.post('/', (req, res) => res.status(201).json({ message: "Recordatorio creado", data: req.body }));
router.delete('/:id', (req, res) => res.json({ message: "Recordatorio eliminado" }));
module.exports = router;