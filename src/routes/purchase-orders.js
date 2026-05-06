const express = require('express');
const router = express.Router();
const db = require('../config/db');

const CONFIRMED_STATUSES = new Set(['completed', 'confirmed', 'paid', 'approved', 'completado']);

function isConfirmedStatus(status) {
  return CONFIRMED_STATUSES.has(String(status || '').toLowerCase());
}

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

async function getAccount(client, userId) {
  const { rows } = await client.query(
    'SELECT * FROM financial_account WHERE user_id = $1 ORDER BY id LIMIT 1',
    [userId]
  );

  if (rows.length > 0) return rows[0];

  const { rows: created } = await client.query(
    `INSERT INTO financial_account (user_id, account_type, currency, balance)
     VALUES ($1, 'standard', 'MXN', 0.00)
     RETURNING *`,
    [userId]
  );

  return created[0];
}

async function getLinkedItems(client, purchaseOrderId) {
  const { rows } = await client.query(
    `SELECT
       pi.*,
       p.id AS post_id,
       p.author_user_id,
       p.title AS post_title,
       p.price AS post_price
     FROM purchase_item pi
     LEFT JOIN post p ON p.slug = pi.sku OR p.id::text = pi.sku
     WHERE pi.purchase_order_id = $1
     ORDER BY pi.id`,
    [purchaseOrderId]
  );

  return rows;
}

function getOrderAmount(order, items) {
  const itemsTotal = items.reduce((sum, item) => {
    const amount = Number(item.line_total || item.unit_price || item.post_price || 0);
    return sum + Math.abs(amount);
  }, 0);

  return toMoney(itemsTotal || order.total_amount || 0);
}

async function deleteLinkedPosts(client, items) {
  for (const item of items) {
    const sku = String(item.sku || '').trim();
    if (!sku) continue;

    await client.query(
      'DELETE FROM post WHERE slug = $1 OR id::text = $1',
      [sku]
    );
  }
}

async function recordCompletedOrderMovements(client, order, items) {
  const buyerAccount = await getAccount(client, order.user_id);
  const buyerAccountId = buyerAccount.id;

  for (const item of items) {
    const amount = toMoney(item.line_total || item.unit_price || item.post_price || 0);
    const label = item.post_title || item.item_name || `Orden #${order.id}`;

    if (amount <= 0) continue;

    await client.query(
      `INSERT INTO transaction (user_id, financial_account_id, amount, currency, status, description)
       VALUES ($1, $2, $3, COALESCE($4, 'MXN'), 'completed', $5)`,
      [order.user_id, buyerAccountId, -Math.abs(amount), order.currency, `Compra: ${label}`]
    );

    await client.query(
      `UPDATE financial_account
          SET balance = balance - $1,
              updated_at = NOW()
        WHERE id = $2`,
      [Math.abs(amount), buyerAccountId]
    );

    if (item.author_user_id && String(item.author_user_id) !== String(order.user_id)) {
      const sellerAccount = await getAccount(client, item.author_user_id);

      await client.query(
        `INSERT INTO transaction (user_id, financial_account_id, amount, currency, status, description)
         VALUES ($1, $2, $3, COALESCE($4, 'MXN'), 'completed', $5)`,
        [item.author_user_id, sellerAccount.id, Math.abs(amount), order.currency, `Venta: ${label}`]
      );

      await client.query(
        `UPDATE financial_account
            SET balance = balance + $1,
                updated_at = NOW()
          WHERE id = $2`,
        [Math.abs(amount), sellerAccount.id]
      );
    }
  }
}

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const params = [];
    let query = 'SELECT * FROM purchase_order';

    if (user_id) {
      params.push(user_id);
      query += ' WHERE user_id = $1';
    }

    query += ' ORDER BY id';

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM purchase_order WHERE id = $1', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, status, total_amount, currency } = req.body;

    if (!user_id || total_amount === undefined || total_amount === null) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: user_id y total_amount' });
    }

    if (isConfirmedStatus(status)) {
      return res.status(400).json({
        message: 'Primero crea la orden como pending y después confírmala con PUT /purchase-orders/:id'
      });
    }

    const { rows } = await db.query(
      `INSERT INTO purchase_order (user_id, status, total_amount, currency)
       VALUES ($1, COALESCE($2, 'pending'), $3, COALESCE($4, 'MXN'))
       RETURNING *`,
      [user_id, status, total_amount, currency]
    );

    res.status(201).json({ message: 'Orden creada', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const client = await db.connect();

  try {
    const { user_id, status, total_amount, currency } = req.body;

    await client.query('BEGIN');

    const { rows: existingRows } = await client.query(
      'SELECT * FROM purchase_order WHERE id = $1 FOR UPDATE',
      [req.params.id]
    );

    if (existingRows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const existingOrder = existingRows[0];

    const nextOrder = {
      ...existingOrder,
      user_id: user_id ?? existingOrder.user_id,
      status: status ?? existingOrder.status,
      total_amount: total_amount ?? existingOrder.total_amount,
      currency: currency ?? existingOrder.currency
    };

    const willComplete =
      isConfirmedStatus(nextOrder.status) && !isConfirmedStatus(existingOrder.status);

    if (willComplete) {
      const items = await getLinkedItems(client, req.params.id);

      if (items.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'La orden no tiene productos agregados' });
      }

      const { rows: methodRows } = await client.query(
        `SELECT id FROM payment_method
         WHERE user_id = $1 AND LOWER(COALESCE(status, 'active')) = 'active'
         LIMIT 1`,
        [nextOrder.user_id]
      );

      if (methodRows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Agrega un metodo de pago antes de comprar' });
      }

      if (items.some((item) => item.author_user_id && String(item.author_user_id) === String(nextOrder.user_id))) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'No puedes comprar tus propias publicaciones' });
      }

      const buyerAccount = await getAccount(client, nextOrder.user_id);
      const availableBalance = toMoney(buyerAccount.balance);
      const orderAmount = getOrderAmount(nextOrder, items);

      if (availableBalance < orderAmount) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          message: `Saldo insuficiente. Saldo actual: $${availableBalance.toFixed(2)}, total de compra: $${orderAmount.toFixed(2)}`
        });
      }
    }

    const { rows: updatedRows } = await client.query(
      `UPDATE purchase_order
          SET user_id      = COALESCE($1, user_id),
              status       = COALESCE($2, status),
              total_amount = COALESCE($3, total_amount),
              currency     = COALESCE($4, currency),
              updated_at   = NOW()
        WHERE id = $5
        RETURNING *`,
      [user_id, status, total_amount, currency, req.params.id]
    );

    const updatedOrder = updatedRows[0];

    if (willComplete) {
      const items = await getLinkedItems(client, updatedOrder.id);
      await recordCompletedOrderMovements(client, updatedOrder, items);
      await deleteLinkedPosts(client, items);
    }

    await client.query('COMMIT');

    res.json({ message: `Orden ${req.params.id} actualizada`, data: updatedOrder });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr.message);
    }

    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM purchase_order WHERE id = $1', [req.params.id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json({ message: `Orden ${req.params.id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
