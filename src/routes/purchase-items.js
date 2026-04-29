const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM purchase_item ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM purchase_item WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { purchase_order_id, item_name, sku, quantity, unit_price, line_total } = req.body;
    const computedTotal = line_total ?? (Number(quantity) * Number(unit_price));
    const { rows } = await db.query(
      `INSERT INTO purchase_item
         (purchase_order_id, item_name, sku, quantity, unit_price, line_total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [purchase_order_id, item_name, sku || null, quantity, unit_price, computedTotal]
    );
    res.status(201).json({ message: 'Item agregado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { purchase_order_id, item_name, sku, quantity, unit_price, line_total } = req.body;
    const { rows } = await db.query(
      `UPDATE purchase_item
         SET purchase_order_id = COALESCE($1, purchase_order_id),
             item_name         = COALESCE($2, item_name),
             sku               = COALESCE($3, sku),
             quantity          = COALESCE($4, quantity),
             unit_price        = COALESCE($5, unit_price),
             line_total        = COALESCE($6, line_total),
             updated_at        = NOW()
       WHERE id = $7
       RETURNING *`,
      [purchase_order_id, item_name, sku, quantity, unit_price, line_total, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item actualizado', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM purchase_item WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;