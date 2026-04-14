const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const customerRoutes = require('./routes/customer.route');
const invoiceRoutes = require('./routes/invoice.route');
const paymentRoutes = require('./routes/payment.route');
const packageRoutes = require('./routes/package.route');
const dashboardRoutes = require('./routes/dashboard.route');
const rewardRoutes = require('./routes/reward.route');
const deviceRoutes = require('./routes/device.route');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/devices', deviceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
