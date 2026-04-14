const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portal.controller');
const portalRewardsController = require('../controllers/portalRewards.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/me/modem', authenticate, authorize(['customer']), portalController.getMyModem);
router.post('/me/modem/wifi/password', authenticate, authorize(['customer']), portalController.changeWifiPassword);

router.get('/me/rewards', authenticate, authorize(['customer']), portalRewardsController.getMyRewards);
router.get('/me/rewards/transactions', authenticate, authorize(['customer']), portalRewardsController.getMyRewardTransactions);
router.get('/me/rewards/catalog', authenticate, authorize(['customer']), portalRewardsController.getRewardCatalog);
router.post('/me/rewards/redeem', authenticate, authorize(['customer']), express.json({ limit: '1mb' }), portalRewardsController.redeemReward);
router.get('/me/rewards/redemptions', authenticate, authorize(['customer']), portalRewardsController.getMyRedemptions);

module.exports = router;
