const db = require('../config/database');

const InvoiceService = {
  async getAllInvoices(filters = {}) {
    const { search, status, customer_id } = filters;
    let query = `
      SELECT i.*, c.name as customer_name, p.package_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN packages p ON i.package_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (i.invoice_number ILIKE $${params.length} OR c.name ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      query += ` AND i.status = $${params.length}`;
    }

    if (customer_id) {
      params.push(customer_id);
      query += ` AND i.customer_id = $${params.length}`;
    }

    query += ' ORDER BY i.created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  },

  async getInvoiceById(id) {
    const query = `
      SELECT i.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address,
             p.package_name, p.speed
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN packages p ON i.package_id = p.id
      WHERE i.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async createInvoice(data) {
    const { customer_id, package_id, amount, status, issue_date, due_date, notes } = data;
    const query = `
      INSERT INTO invoices (customer_id, package_id, amount, status, issue_date, due_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [customer_id, package_id, amount, status || 'pending', issue_date || new Date(), due_date, notes];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateInvoice(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return this.getInvoiceById(id);

    values.push(id);
    const query = `
      UPDATE invoices
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deleteInvoice(id) {
    const query = 'DELETE FROM invoices WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },

  async getCustomerInvoices(customerId) {
    const query = `
      SELECT i.*, p.package_name
      FROM invoices i
      LEFT JOIN packages p ON i.package_id = p.id
      WHERE i.customer_id = $1
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query, [customerId]);
    return result.rows;
  }
};

module.exports = InvoiceService;
