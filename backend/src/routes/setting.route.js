const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize(['admin']), settingController.getAll);
router.patch('/', authenticate, authorize(['admin']), settingController.update);

module.exports = router;
