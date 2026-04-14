const pool = require('../config/database');

class AgentService {
  async getDashboardStats(agentId) {
    const queries = {
      totalCustomers: 'SELECT COUNT(*) FROM customers WHERE agent_id = $1',
      activeCustomers: 'SELECT COUNT(*) FROM customers WHERE agent_id = $1 AND status = \'active\'',
      totalCommission: 'SELECT SUM(amount) FROM agent_commissions WHERE agent_id = $1 AND status = \'earned\'',
      pendingCommission: 'SELECT SUM(amount) FROM agent_commissions WHERE agent_id = $1 AND status = \'pending\''
    };

    const [total, active, earned, pending] = await Promise.all([
      pool.query(queries.totalCustomers, [agentId]),
      pool.query(queries.active, [agentId]),
      pool.query(queries.totalCommission, [agentId]),
      pool.query(queries.pendingCommission, [agentId])
    ]);

    return {
      totalCustomers: parseInt(total.rows[0].count),
      activeCustomers: parseInt(active.rows[0].count),
      totalCommission: parseInt(earned.rows[0].sum || 0),
      pendingCommission: parseInt(pending.rows[0].sum || 0)
    };
  }

  async getSubCustomers(agentId) {
    const query = `
      SELECT c.*, p.package_name, p.price as package_price
      FROM customers c
      LEFT JOIN packages p ON c.package_id = p.id
      WHERE c.agent_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [agentId]);
    return result.rows;
  }

  async getCommissions(agentId) {
    const query = `
      SELECT ac.*, c.name as customer_name, p.payment_number
      FROM agent_commissions ac
      JOIN customers c ON ac.customer_id = c.id
      JOIN payments p ON ac.payment_id = p.id
      WHERE ac.agent_id = $1
      ORDER BY ac.created_at DESC
    `;
    const result = await pool.query(query, [agentId]);
    return result.rows;
  }

  async getWithdrawals(agentId) {
    const query = 'SELECT * FROM agent_withdrawals WHERE agent_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [agentId]);
    return result.rows;
  }

  async requestWithdrawal(agentId, data) {
    const { amount, bank_name, account_number, account_name } = data;
    const query = `
      INSERT INTO agent_withdrawals (agent_id, amount, bank_name, account_number, account_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [agentId, amount, bank_name, account_number, account_name]);
    return result.rows[0];
  }
}

module.exports = new AgentService();
