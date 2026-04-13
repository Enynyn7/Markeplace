const express = require('express');
const router = express.Router();

const mockPost = { id: 10, seller_id: 5, category_id: 2, related_ticket_id: null, description: "Producto de prueba", includes_ticket: false };

router.get('/', (req, res) => res.json([mockPost]));
router.get('/:id', (req, res) => res.json(mockPost));
router.post('/', (req, res) => res.status(201).json({ message: "Post creado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Post ${req.params.id} actualizado` }));
router.delete('/:id', (req, res) => res.json({ message: `Post ${req.params.id} eliminado` }));

module.exports = router;