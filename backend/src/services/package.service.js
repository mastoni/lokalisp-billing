const db = require('../config/database');

const PackageService = {
  async getAll(filters = {}) {
    const { is_active } = filters;
    let query = 'SELECT * FROM packages WHERE 1=1';
    const params = [];

    if (is_active !== undefined) {
      params.push(is_active);
      query += ` AND is_active = $${params.length}`;
    }

    query += ' ORDER BY price ASC';
    
    const result = await db.query(query, params);
    return result.rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM packages WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async create(data) {
    const { package_name, description, price, speed, bandwidth_limit, is_active } = data;
    const query = `
      INSERT INTO packages (package_name, description, price, speed, bandwidth_limit, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [package_name, description, price, speed, bandwidth_limit, is_active !== undefined ? is_active : true];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (['package_name', 'description', 'price', 'speed', 'bandwidth_limit', 'is_active'].includes(key)) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const query = `
      UPDATE packages 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM packages WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },
};

module.exports = PackageService;
