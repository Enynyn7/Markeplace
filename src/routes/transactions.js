const express = require('express');
const router = express.Router();

const mockTransaction = { id: 100, amount: 500, status: "completed" };

router.get('/', (req, res) => res.json([mockTransaction]));
router.get('/:id', (req, res) => res.json(mockTransaction));
router.post('/', (req, res) => res.status(201).json({ message: "Transacción registrada", data: req.body }));
// DELETE
router.delete('/:id', (req, res) => {
  res.json({ message: `Transacción ${req.params.id} eliminada` });
});

module.exports = router;