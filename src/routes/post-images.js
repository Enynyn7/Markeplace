const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, post_id: 10, url: "imagen_mock.jpg" }]));
router.get('/:id', (req, res) => res.json({ id: 1, post_id: 10, url: "imagen_mock.jpg" }));
router.post('/', (req, res) => res.status(201).json({ message: "Imagen subida", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Imagen actualizada" }));
router.delete('/:id', (req, res) => res.json({ message: "Imagen eliminada" }));
module.exports = router;