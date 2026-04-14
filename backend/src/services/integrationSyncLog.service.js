const db = require('../config/database');

const IntegrationSyncLogService = {
  async start({ provider, job_name }) {
    const query = `
      INSERT INTO integration_sync_logs (provider, job_name, status)
      VALUES ($1, $2, 'running')
      RETURNING *
    `;
    const res = await db.query(query, [provider, job_name]);
    return res.rows[0];
  },

  async finish(id, { status, started_at, details = null, error_message = null }) {
    const finished_at = new Date();
    const duration_ms = started_at ? Math.max(0, finished_at.getTime() - new Date(started_at).getTime()) : null;
    const query = `
      UPDATE integration_sync_logs
      SET status = $2, finished_at = $3, duration_ms = $4, details = $5, error_message = $6
      WHERE id = $1
      RETURNING *
    `;
    const res = await db.query(query, [id, status, finished_at, duration_ms, details, error_message]);
    return res.rows[0] || null;
  },
};

module.exports = IntegrationSyncLogService;

