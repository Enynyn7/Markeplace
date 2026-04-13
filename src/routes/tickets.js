const express = require('express');
const router = express.Router();

const mockTicket = { id: 4, owner_id: 2, is_sold: false, price: 500 };

router.get('/', (req, res) => res.json([mockTicket]));
router.get('/:id', (req, res) => res.json(mockTicket));
router.post('/', (req, res) => res.status(201).json({ message: "Ticket asignado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Ticket ${req.params.id} actualizado` }));
router.delete('/:id', (req, res) => res.json({ message: `Ticket ${req.params.id} eliminado` }));

module.exports = router;