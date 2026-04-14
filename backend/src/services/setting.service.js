const db = require('../config/database');

const SettingService = {
  async getAll() {
    const query = 'SELECT * FROM system_settings ORDER BY category, key';
    const result = await db.query(query);
    
    // Group by category for easier frontend handling
    return result.rows.reduce((acc, row) => {
      if (!acc[row.category]) {
        acc[row.category] = [];
      }
      acc[row.category].push(row);
      return acc;
    }, {});
  },

  async getByCategory(category) {
    const query = 'SELECT * FROM system_settings WHERE category = $1 ORDER BY key';
    const result = await db.query(query, [category]);
    return result.rows;
  },

  async getCategoryMap(category) {
    const rows = await this.getByCategory(category);
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  },

  async getValue(key) {
    const query = 'SELECT value FROM system_settings WHERE key = $1';
    const result = await db.query(query, [key]);
    return result.rows[0]?.value ?? null;
  },

  async updateBatch(settings) {
    // settings: [{ key: 'xxx', value: 'yyy' }, ...]
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const { key, value } of settings) {
        const query = `
          UPDATE system_settings 
          SET value = $1, updated_at = CURRENT_TIMESTAMP
          WHERE key = $2
          RETURNING *
        `;
        const result = await client.query(query, [value, key]);
        if (result.rows[0]) {
          results.push(result.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = SettingService;
