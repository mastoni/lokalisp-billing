const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

router.get('/', invoiceController.getAll);
router.get('/public/:invoiceNumber', invoiceController.getPublicByNumber);
router.get('/:id', invoiceController.getById);
router.post('/', invoiceController.create);
router.post('/:id/remind', invoiceController.remind);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);

module.exports = router;
