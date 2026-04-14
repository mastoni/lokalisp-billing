const { Pool } = require('pg');
const pool = require('../config/database');

class UserModel {
  async findByUsername(username) {
    const query = `
      SELECT u.*, r.name as role_name, r.description as role_description
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1 AND u.is_active = true
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = `
      SELECT u.*, r.name as role_name, r.description as role_description
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1 AND u.is_active = true
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    const query = `
      SELECT u.id, u.username, u.email, u.full_name, u.phone, u.is_active, u.last_login,
             u.created_at, u.updated_at,
             r.id as role_id, r.name as role_name, r.description as role_description
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async getUserPermissions(roleId) {
    const query = `
      SELECT p.name, p.description, p.resource, p.action
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const result = await pool.query(query, [roleId]);
    return result.rows;
  }

  async create(userData) {
    const { username, email, passwordHash, fullName, phone, roleId } = userData;
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, phone, role_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, full_name, phone, role_id, created_at
    `;
    const result = await pool.query(query, [username, email, passwordHash, fullName, phone, roleId]);
    return result.rows[0];
  }

  async updateLastLogin(userId) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [userId]);
  }

  async createSession(userId, token, expiresAt) {
    const query = 'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)';
    await pool.query(query, [userId, token, expiresAt]);
  }

  async findSession(token) {
    const query = `
      SELECT * FROM user_sessions 
      WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  async deleteSession(userId) {
    const query = 'DELETE FROM user_sessions WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = new UserModel();
