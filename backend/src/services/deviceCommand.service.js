const db = require('../config/database');

const DeviceCommandService = {
  async create({ device_id = null, command_name, payload = null, status = 'pending', result = null }) {
    const query = `
      INSERT INTO device_commands (device_id, command_name, payload, status, result)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [device_id, command_name, payload, status, result];
    const res = await db.query(query, values);
    return res.rows[0];
  },

  async updateStatus(id, { status, result = null }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (result !== undefined) {
      fields.push(`result = $${idx++}`);
      values.push(result);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE device_commands
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    const res = await db.query(query, values);
    return res.rows[0] || null;
  },

  async getPending(limit = 10) {
    const query = `
      SELECT dc.*, d.acs_device_id
      FROM device_commands dc
      JOIN devices d ON dc.device_id = d.id
      WHERE dc.status = 'pending'
      ORDER BY dc.created_at ASC
      LIMIT $1
    `;
    const res = await db.query(query, [limit]);
    return res.rows;
  },
};

module.exports = DeviceCommandService;
