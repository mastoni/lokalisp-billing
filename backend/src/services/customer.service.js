const db = require('../config/database');

const CustomerService = {
  async getAllCustomers(filters = {}) {
    const { search, status, device_id } = filters;
    let query = `
      SELECT c.*, d.name as router_name, d.type as router_type
      FROM customers c
      LEFT JOIN devices d ON c.device_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (c.name ILIKE $${params.length} OR c.email ILIKE $${params.length} OR c.ont_serial_number ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      query += ` AND c.status = $${params.length}`;
    }

    if (device_id) {
      params.push(device_id);
      query += ` AND c.device_id = $${params.length}`;
    }

    query += ' ORDER BY c.created_at DESC';
    
    const result = await db.query(query, params);
    return result.rows;
  },

  async getCustomerById(id) {
    const query = `
      SELECT c.*, d.name as router_name, d.type as router_type, d.ip_address as router_ip
      FROM customers c
      LEFT JOIN devices d ON c.device_id = d.id
      WHERE c.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async createCustomer(data) {
    const { name, email, phone, address, package_id, status, ont_serial_number, device_id } = data;
    const query = `
      INSERT INTO customers (name, email, phone, address, package_id, status, ont_serial_number, device_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [name, email, phone, address, package_id, status || 'active', ont_serial_number, device_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateCustomer(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return this.getCustomerById(id);

    values.push(id);
    const query = `
      UPDATE customers 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deleteCustomer(id) {
    const query = 'DELETE FROM customers WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },
};

module.exports = CustomerService;
