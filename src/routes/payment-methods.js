const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, user_id: 3, type: "tarjeta", last_four: "1234" }]));
router.get('/:id', (req, res) => res.json({ id: 1, user_id: 3, type: "tarjeta", last_four: "1234" }));
router.post('/', (req, res) => res.status(201).json({ message: "Método guardado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Método actualizado" }));
router.delete('/:id', (req, res) => res.json({ message: "Método eliminado" }));
module.exports = router;