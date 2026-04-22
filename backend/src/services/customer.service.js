const db = require('../config/database');
const IntegrationService = require('./integration.service');

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

  async getCustomerByEmail(email) {
    const query = `
      SELECT c.*, d.name as router_name, d.type as router_type, d.ip_address as router_ip
      FROM customers c
      LEFT JOIN devices d ON c.device_id = d.id
      WHERE c.email = $1
      LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  },

  async findCustomerForUser({ email, full_name, phone }) {
    if (email) {
      const byEmail = await this.getCustomerByEmail(email);
      if (byEmail) return byEmail;
    }

    if (phone) {
      const query = `
        SELECT c.*, d.name as router_name, d.type as router_type, d.ip_address as router_ip
        FROM customers c
        LEFT JOIN devices d ON c.device_id = d.id
        WHERE c.phone = $1
        LIMIT 1
      `;
      const res = await db.query(query, [phone]);
      if (res.rows[0]) return res.rows[0];
    }

    if (full_name) {
      const query = `
        SELECT c.*, d.name as router_name, d.type as router_type, d.ip_address as router_ip
        FROM customers c
        LEFT JOIN devices d ON c.device_id = d.id
        WHERE c.name ILIKE $1
        ORDER BY c.created_at DESC
        LIMIT 1
      `;
      const res = await db.query(query, [`%${full_name}%`]);
      if (res.rows[0]) return res.rows[0];
    }

    return null;
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
    const newCustomer = result.rows[0];

    // Sync to MikroTik/RADIUS if device_id is provided and status is active
    if (newCustomer && device_id && (status === 'active' || !status)) {
      try {
        const username = newCustomer.email || newCustomer.phone || newCustomer.id;
        const password = newCustomer.phone || '12345678';

        await IntegrationService.syncMikrotikSecret({
          name: username,
          password: password,
          comment: `Customer: ${newCustomer.name}`
        });
        
        // --- RADIUS SYNC ---
        await IntegrationService.syncRadiusUser({
          username,
          password
        });

        // Default group assignment
        await IntegrationService.setRadiusUserGroup(username, 'Default-Profile');
      } catch (err) {
        console.error('Failed to sync to MikroTik/RADIUS on creation:', err.message);
      }
    }

    return newCustomer;
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
    const updated = result.rows[0];

    // Handle status changes for MikroTik/RADIUS
    if (updated) {
      if (data.status === 'active') {
        try {
          const username = updated.email || updated.phone || updated.id;
          const password = updated.phone || '12345678';

          await IntegrationService.syncMikrotikSecret({
            name: username,
            password: password,
            comment: `Customer: ${updated.name}`
          });

          await IntegrationService.syncRadiusUser({
            username: username,
            password: password
          });
          await IntegrationService.setRadiusUserGroup(username, 'Default-Profile');

        } catch (err) {
          console.error('MikroTik/RADIUS sync error on status change:', err.message);
        }
      } else if (data.status === 'isolir' || data.status === 'non-active') {
        try {
          const username = updated.email || updated.phone || updated.id;
          await IntegrationService.kickMikrotikSession(username);
          
          if (data.status === 'isolir') {
            await IntegrationService.setRadiusUserGroup(username, 'Isolir-Profile');
          }
        } catch (err) {
          console.error('MikroTik/RADIUS management error:', err.message);
        }
      }
    }

    // Trigger point awarding if status becomes active
    if (data.status === 'active' && updated) {
      try {
        const RewardService = require('./reward.service');
        await RewardService.checkAndAwardReferralPoints(id);
      } catch (err) {
        console.error('Error in checkAndAwardReferralPoints:', err);
      }
    }

    return updated;
  },

  async deleteCustomer(id) {
    const query = 'DELETE FROM customers WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },

  async touchLastSeenByAcsDeviceId(acsDeviceId, at = new Date()) {
    const query = `
      UPDATE customers
      SET last_seen = $2, updated_at = CURRENT_TIMESTAMP
      WHERE acs_device_id = $1
    `;
    const result = await db.query(query, [acsDeviceId, at]);
    return result.rowCount || 0;
  },

  async updateAcsMappingBySerialNumber(serialNumber, acsDeviceId) {
    const query = `
      UPDATE customers
      SET acs_device_id = $2, updated_at = CURRENT_TIMESTAMP
      WHERE ont_serial_number = $1 AND (acs_device_id IS NULL OR acs_device_id <> $2)
      RETURNING id
    `;
    const result = await db.query(query, [serialNumber, acsDeviceId]);
    return result.rowCount || 0;
  },
};

module.exports = CustomerService;
