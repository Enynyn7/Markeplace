const express = require('express');
const router = express.Router();

const mockOrder = { id: 1, buyer_id: 8, total: 150.00 };

router.get('/', (req, res) => res.json([mockOrder]));
router.get('/:id', (req, res) => res.json(mockOrder));
router.post('/', (req, res) => res.status(201).json({ message: "Orden creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Orden ${req.params.id} actualizada` }));
router.delete('/:id', (req, res) => res.json({ message: `Orden ${req.params.id} eliminada` }));

module.exports = router;