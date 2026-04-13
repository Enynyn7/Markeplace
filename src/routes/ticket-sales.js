const express = require('express');
const router = express.Router();

const mockSale = { id: 1, ticket_id: 4, seller_id: 2, buyer_id: 9, sale_date: "2026-04-07T12:00:00" };

router.get('/', (req, res) => res.json([mockSale]));
router.get('/:id', (req, res) => res.json(mockSale));
router.post('/', (req, res) => res.status(201).json({ message: "Venta registrada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Venta ${req.params.id} actualizada` }));
router.delete('/:id', (req, res) => res.json({ message: `Venta ${req.params.id} eliminada` }));

module.exports = router;