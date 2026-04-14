const db = require('../config/database');

const DeviceService = {
  async getAllDevices() {
    const query = 'SELECT * FROM devices ORDER BY name ASC';
    const result = await db.query(query);
    return result.rows;
  },

  async getDeviceById(id) {
    const query = 'SELECT * FROM devices WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async createDevice(data) {
    const { name, type, ip_address, username, password, location, status } = data;
    const query = `
      INSERT INTO devices (name, type, ip_address, username, password, location, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [name, type, ip_address, username, password, location, status || 'active'];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateDevice(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return this.getDeviceById(id);

    values.push(id);
    const query = `
      UPDATE devices 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deleteDevice(id) {
    const query = 'DELETE FROM devices WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },

  async touchLastSeenByAcsDeviceId(acsDeviceId, at = new Date()) {
    const query = `
      UPDATE devices
      SET last_seen = $2, updated_at = CURRENT_TIMESTAMP
      WHERE acs_device_id = $1
    `;
    const result = await db.query(query, [acsDeviceId, at]);
    return result.rowCount || 0;
  },
};

module.exports = DeviceService;
