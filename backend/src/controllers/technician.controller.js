const technicianService = require('../services/technician.service');

class TechnicianController {
  async getDashboard(req, res) {
    try {
      const technicianId = req.user.id;
      const stats = await technicianService.getDashboardStats(technicianId);
      const tickets = await technicianService.getTickets(technicianId);
      
      res.json({
        success: true,
        data: { stats, tickets }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTickets(req, res) {
    try {
      const technicianId = req.user.id;
      const { status } = req.query;
      const tickets = await technicianService.getTickets(technicianId, status);
      res.json({ success: true, data: tickets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const technicianId = req.user.id;
      const { status, notes } = req.body;
      const ticket = await technicianService.updateTicketStatus(id, technicianId, status, notes);
      res.json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async logMaintenance(req, res) {
    try {
      const technicianId = req.user.id;
      const log = await technicianService.addMaintenanceLog({
        ...req.body,
        technician_id: technicianId
      });
      res.json({ success: true, data: log });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TechnicianController();
