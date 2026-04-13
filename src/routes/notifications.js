const express = require('express');
const router = express.Router();
const mockNotification = { id: 1, user_id: 9, message: "Tu compra fue registrada", is_read: false, reference_id: 1 };

router.get('/', (req, res) => res.json([mockNotification]));
router.get('/:id', (req, res) => res.json(mockNotification));
router.post('/', (req, res) => res.status(201).json({ message: "Notificación creada", data: req.body }));
router.put('/:id', (req, res) => res.json({ message: "Notificación leída" }));
router.delete('/:id', (req, res) => res.json({ message: "Notificación eliminada" }));
module.exports = router;