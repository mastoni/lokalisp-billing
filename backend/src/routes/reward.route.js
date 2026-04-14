const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/reward.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate, authorize(['admin']));

// Get reward statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await rewardController.getRewardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Reward stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reward statistics',
    });
  }
});

// Get customer points
router.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    
    const result = await rewardController.getCustomerPoints(page, limit, search);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Customer points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer points',
    });
  }
});

// Get earning rules
router.get('/earning-rules', async (req, res) => {
  try {
    const rules = await rewardController.getEarningRules();
    res.json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error('Earning rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earning rules',
    });
  }
});

// Create earning rule
router.post('/earning-rules', async (req, res) => {
  try {
    const rule = await rewardController.createEarningRule(req.body);
    res.status(201).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error('Create earning rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create earning rule',
    });
  }
});

// Update earning rule
router.patch('/earning-rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await rewardController.updateEarningRule(id, req.body);
    if (!rule) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }
    res.json({ success: true, data: rule });
  } catch (error) {
    console.error('Update earning rule error:', error);
    res.status(500).json({ success: false, message: 'Failed to update earning rule' });
  }
});

// Get redemption rewards
router.get('/rewards', async (req, res) => {
  try {
    const rewards = await rewardController.getAllRedemptionRewards();
    res.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error('Redemption rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch redemption rewards',
    });
  }
});

// Create redemption reward
router.post('/rewards', async (req, res) => {
  try {
    const reward = await rewardController.createRedemptionReward(req.body);
    res.status(201).json({
      success: true,
      data: reward,
    });
  } catch (error) {
    console.error('Create redemption reward error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create redemption reward',
    });
  }
});

// Update redemption reward
router.patch('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await rewardController.updateRedemptionReward(id, req.body);
    if (!reward) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }
    res.json({ success: true, data: reward });
  } catch (error) {
    console.error('Update redemption reward error:', error);
    res.status(500).json({ success: false, message: 'Failed to update redemption reward' });
  }
});

// Get redemption requests
router.get('/redemptions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || null;
    
    const result = await rewardController.getRedemptions(page, limit, status);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Redemptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch redemptions',
    });
  }
});

// Process redemption (approve/reject)
router.patch('/redemptions/:id/process', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"',
      });
    }
    
    const result = await rewardController.processRedemption(id, status, reason);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Process redemption error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process redemption',
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const tier = req.query.tier || null;
    
    const result = await rewardController.getLeaderboard(page, limit, tier);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
    });
  }
});

// Get tier distribution
router.get('/tier-distribution', async (req, res) => {
  try {
    const distribution = await rewardController.getTierDistribution();
    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    console.error('Tier distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tier distribution',
    });
  }
});

// Adjust customer points
router.post('/customers/:id/adjust', async (req, res) => {
  try {
    const { id } = req.params;
    const { points, reason } = req.body;
    
    if (!points || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Points and reason are required',
      });
    }
    
    const result = await rewardController.adjustCustomerPoints(id, points, reason);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Adjust points error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to adjust points',
    });
  }
});

module.exports = router;
