const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/test/:provider', authenticate, authorize(['admin']), integrationController.test);
router.post('/sync/genieacs', authenticate, authorize(['admin']), integrationController.syncAcs);
router.get('/acs/query', authenticate, authorize(['admin']), integrationController.getAcsDevices);
router.get('/mikrotik/data', authenticate, authorize(['admin']), integrationController.getMikrotikData);

module.exports = router;
