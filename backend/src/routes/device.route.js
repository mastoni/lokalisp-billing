const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/my-device', authenticate, deviceController.getMyDevice);
router.get('/get-wifi', authenticate, deviceController.getWifiInfo);
router.post('/reboot', authenticate, deviceController.rebootDevice);
router.post('/wifi-password', authenticate, deviceController.changeWifiPassword);

router.get('/', authenticate, deviceController.getAll);
router.get('/:id', authenticate, deviceController.getById);
router.post('/', authenticate, deviceController.create);

module.exports = router;
