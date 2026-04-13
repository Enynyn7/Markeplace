const express = require('express');
const router = express.Router();
const mockCategory = { id: 2, name: "Electrónica", description: "Cosas de tecnología" };

router.get('/', (req, res) => res.json([mockCategory]));
router.get('/:id', (req, res) => res.json(mockCategory));
router.post('/', (req, res) => res.status(201).json({ message: "Categoría creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Categoría actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "Categoría eliminada" }));
module.exports = router;