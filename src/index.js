const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal (health check)
app.get('/', (req, res) => {
  res.json({ message: '🚀 API del Marketplace UDLAP funcionando al 100%' });
});

// Importar todas las rutas del contrato
app.use('/roles', require('./routes/roles'));
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

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});