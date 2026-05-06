const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await db.ready;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: '🚀 API del Marketplace UDLAP funcionando al 100%' });
});

app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/profiles', require('./routes/profiles'));
app.use('/financial-accounts', require('./routes/financial-accounts'));
app.use('/financial-movements', require('./routes/financial-movements'));
app.use('/tickets', require('./routes/tickets'));
app.use('/ticket-sales', require('./routes/ticket-sales'));
app.use('/ticket-payment-evidences', require('./routes/ticket-payment-evidences'));
app.use('/payment-reminders', require('./routes/payment-reminders'));
app.use('/categories', require('./routes/categories'));
app.use('/posts', require('./routes/posts'));
app.use('/post-images', require('./routes/post-images'));
app.use('/purchase-orders', require('./routes/purchase-orders'));
app.use('/purchase-items', require('./routes/purchase-items'));
app.use('/payment-methods', require('./routes/payment-methods'));
app.use('/transactions', require('./routes/transactions'));
app.use('/notifications', require('./routes/notifications'));
app.use('/reports', require('./routes/reports'));
app.use('/faqs', require('./routes/faqs'));
app.use('/support-requests', require('./routes/support-requests'));

module.exports = app;
