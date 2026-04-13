const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, user_id: 2, balance: 1500.50 }]));
router.get('/:id', (req, res) => res.json({ id: 1, user_id: 2, balance: 1500.50 }));
router.post('/', (req, res) => res.status(201).json({ message: "Cuenta creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Cuenta actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "Cuenta eliminada" }));
module.exports = router;