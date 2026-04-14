const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

router.post('/genieacs', express.json({ limit: '1mb' }), webhookController.genieAcsWebhook);

module.exports = router;
