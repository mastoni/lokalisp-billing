const pool = require('../config/database');

class TechnicianService {
  async getDashboardStats(technicianId) {
    const queries = {
      pending: 'SELECT COUNT(*) FROM support_tickets WHERE (technician_id = $1 OR technician_id IS NULL) AND status = \'open\'',
      scheduled: 'SELECT COUNT(*) FROM support_tickets WHERE technician_id = $1 AND status = \'assigned\'',
      active: 'SELECT COUNT(*) FROM support_tickets WHERE technician_id = $1 AND status = \'in_progress\'',
      completed: 'SELECT COUNT(*) FROM maintenance_logs WHERE technician_id = $1'
    };

    const [pending, scheduled, active, completed] = await Promise.all([
      pool.query(queries.pending, [technicianId]),
      pool.query(queries.scheduled, [technicianId]),
      pool.query(queries.active, [technicianId]),
      pool.query(queries.completed, [technicianId])
    ]);

    return {
      pending: parseInt(pending.rows[0].count),
      scheduled: parseInt(scheduled.rows[0].count),
      active: parseInt(active.rows[0].count),
      completed: parseInt(completed.rows[0].count)
    };
  }

  async getTickets(technicianId, status = null) {
    let query = `
      SELECT t.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address
      FROM support_tickets t
      JOIN customers c ON t.customer_id = c.id
      WHERE (t.technician_id = $1 OR t.technician_id IS NULL)
    `;
    const params = [technicianId];

    if (status) {
      query += ' AND t.status = $2';
      params.push(status);
    }

    query += ' ORDER BY t.created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async updateTicketStatus(ticketId, technicianId, status, notes = '') {
    const query = `
      UPDATE support_tickets 
      SET status = $3, technician_id = $2, notes = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [ticketId, technicianId, status, notes]);
    return result.rows[0];
  }

  async addMaintenanceLog(data) {
    const { technician_id, customer_id, action_type, description } = data;
    const query = `
      INSERT INTO maintenance_logs (technician_id, customer_id, action_type, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [technician_id, customer_id, action_type, description]);
    return result.rows[0];
  }
}

module.exports = new TechnicianService();
