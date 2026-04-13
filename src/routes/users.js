const express = require('express');
const router = express.Router();

// Mock data basado en el contrato
const mockUser = { id: 1, role_id: 1, last_login_at: null, name: "Estudiante Prueba" };

router.get('/', (req, res) => res.json([mockUser]));
router.get('/:id', (req, res) => res.json(mockUser));
router.post('/', (req, res) => res.status(201).json({ message: "Usuario creado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: `Usuario ${req.params.id} actualizado` }));
router.delete('/:id', (req, res) => res.json({ message: `Usuario ${req.params.id} eliminado` }));

module.exports = router;