const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, name: "Admin" }, { id: 2, name: "Estudiante" }]));
router.post('/', (req, res) => res.status(201).json({ message: "Rol creado", data: req.body }));
// GET por id
router.get('/:id', (req, res) => {
  res.json({ message: `Rol ${req.params.id} obtenido`, data: { id: req.params.id, name: 'Admin' } });
});

// DELETE
router.delete('/:id', (req, res) => {
  res.json({ message: `Rol ${req.params.id} eliminado` });
});
module.exports = router;