const db = require('../config/database');
const RewardService = require('./reward.service');

const PaymentService = {
  async getAllPayments(filters = {}) {
    const { search, status, customer_id } = filters;
    let query = `
      SELECT p.*, c.name as customer_name, i.invoice_number
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.payment_number ILIKE $${params.length} OR c.name ILIKE $${params.length} OR i.invoice_number ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }

    if (customer_id) {
      params.push(customer_id);
      query += ` AND p.customer_id = $${params.length}`;
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  },

  async getPaymentById(id) {
    const query = `
      SELECT p.*, c.name as customer_name, i.invoice_number, i.amount as invoice_amount
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async createPayment(data) {
    const { invoice_id, customer_id, amount, method, bank, reference_number, notes, status } = data;
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO payments (invoice_id, customer_id, amount, method, bank, reference_number, notes, status, payment_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
      `;
      const values = [invoice_id, customer_id, amount, method, bank, reference_number, notes, status || 'completed'];
      const result = await client.query(query, values);
      const payment = result.rows[0];

      // If status is completed, update the invoice and award rewards
      if (payment.status === 'completed') {
        if (invoice_id) {
          await client.query(
            "UPDATE invoices SET status = 'paid', paid_date = NOW(), updated_at = NOW() WHERE id = $1",
            [invoice_id]
          );
        }

        // Award points
        try {
          await RewardService.recordPaymentReward(customer_id, amount, invoice_id);
        } catch (err) {
          console.error('Error awarding points on payment:', err);
        }
      }

      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async updatePaymentStatus(id, status) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const res = await client.query(
        "UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, id]
      );
      const payment = res.rows[0];

      if (status === 'completed' && payment) {
        if (payment.invoice_id) {
          await client.query(
            "UPDATE invoices SET status = 'paid', paid_date = NOW(), updated_at = NOW() WHERE id = $1",
            [payment.invoice_id]
          );
        }
        await RewardService.recordPaymentReward(payment.customer_id, payment.amount, payment.invoice_id);
      }

      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getCustomerPayments(customerId) {
    const query = `
      SELECT p.*, i.invoice_number
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE p.customer_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query, [customerId]);
    return result.rows;
  }
};

module.exports = PaymentService;
