const express = require('express');
const router = express.Router();
const mockItem = { id: 1, order_id: 1, post_id: 10, seller_id: 5, quantity: 1 };

router.get('/', (req, res) => res.json([mockItem]));
router.get('/:id', (req, res) => res.json(mockItem));
router.post('/', (req, res) => res.status(201).json({ message: "Item agregado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Item actualizado" }));
router.delete('/:id', (req, res) => res.json({ message: "Item eliminado" }));
module.exports = router;