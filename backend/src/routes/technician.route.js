const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technician.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Assuming this exists

// All technician routes require authentication
router.use(authMiddleware.authenticate);

router.get('/dashboard', technicianController.getDashboard);
router.get('/tickets', technicianController.getTickets);
router.put('/tickets/:id', technicianController.updateTicket);
router.post('/maintenance', technicianController.logMaintenance);

module.exports = router;
