const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All agent routes require authentication
router.use(authMiddleware.authenticate);

router.get('/dashboard', agentController.getDashboard);
router.get('/customers', agentController.getCustomers);
router.get('/commissions', agentController.getCommissions);
router.get('/withdrawals', agentController.getWithdrawals);
router.post('/withdraw', agentController.requestWithdrawal);

module.exports = router;
