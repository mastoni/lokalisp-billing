const agentService = require('../services/agent.service');

class AgentController {
  async getDashboard(req, res) {
    try {
      const agentId = req.user.id;
      const stats = await agentService.getDashboardStats(agentId);
      const customers = await agentService.getSubCustomers(agentId);
      
      res.json({
        success: true,
        data: { stats, customers }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCustomers(req, res) {
    try {
      const agentId = req.user.id;
      const customers = await agentService.getSubCustomers(agentId);
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCommissions(req, res) {
    try {
      const agentId = req.user.id;
      const commissions = await agentService.getCommissions(agentId);
      res.json({ success: true, data: commissions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getWithdrawals(req, res) {
    try {
      const agentId = req.user.id;
      const withdrawals = await agentService.getWithdrawals(agentId);
      res.json({ success: true, data: withdrawals });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async requestWithdrawal(req, res) {
    try {
      const agentId = req.user.id;
      const withdrawal = await agentService.requestWithdrawal(agentId, req.body);
      res.json({ success: true, data: withdrawal });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AgentController();
