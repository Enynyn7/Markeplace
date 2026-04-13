const express = require('express');
const router = express.Router();
const mockProfile = { id: 1, user_id: 3, is_scholarship_student: true };

router.get('/', (req, res) => res.json([mockProfile]));
router.get('/:id', (req, res) => res.json(mockProfile));
router.post('/', (req, res) => res.status(201).json({ message: "Perfil creado", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Perfil actualizado" }));
router.delete('/:id', (req, res) => res.json({ message: "Perfil eliminado" }));
module.exports = router;