const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([{ id: 1, account_id: 1, amount: -500, type: "pago_colegiatura" }]));
router.get('/:id', (req, res) => res.json({ id: 1, account_id: 1, amount: -500, type: "pago_colegiatura" }));
router.post('/', (req, res) => res.status(201).json({ message: "Movimiento registrado", data: req.body }));
// DELETE
router.delete('/:id', (req, res) => {
  res.json({ message: `Movimiento ${req.params.id} eliminado` });
});
module.exports = router;