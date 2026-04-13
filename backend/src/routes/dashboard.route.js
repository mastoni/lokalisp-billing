const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await dashboardController.getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
    });
  }
});

// Get recent transactions
router.get('/recent-transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await dashboardController.getRecentTransactions(limit);
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Recent transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent transactions',
    });
  }
});

// Get top customers
router.get('/top-customers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const customers = await dashboardController.getTopCustomers(limit);
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top customers',
    });
  }
});

// Get package distribution
router.get('/package-distribution', async (req, res) => {
  try {
    const distribution = await dashboardController.getPackageDistribution();
    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    console.error('Package distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package distribution',
    });
  }
});

// Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await dashboardController.getRecentActivity(limit);
    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
    });
  }
});

module.exports = router;
