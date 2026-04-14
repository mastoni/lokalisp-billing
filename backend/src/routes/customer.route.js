const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize(['admin']), customerController.getAll);
router.get('/:id', authenticate, authorize(['admin']), customerController.getById);
router.post('/', authenticate, authorize(['admin']), customerController.create);
router.put('/:id', authenticate, authorize(['admin']), customerController.update);
router.delete('/:id', authenticate, authorize(['admin']), customerController.delete);

module.exports = router;
