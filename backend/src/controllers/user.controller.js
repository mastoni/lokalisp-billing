const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.username, u.email, u.full_name, u.phone, u.is_active, u.last_login,
             r.id as role_id, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, roleId } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      roleId
    });

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, phone, roleId, is_active, password } = req.body;
    
    let query = 'UPDATE users SET username = $1, email = $2, full_name = $3, phone = $4, role_id = $5, is_active = $6';
    let values = [username, email, fullName, phone, roleId, is_active, id];
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      query += ', password_hash = $7 WHERE id = $8';
      values = [username, email, fullName, phone, roleId, is_active, passwordHash, id];
    } else {
      query += ' WHERE id = $7';
    }

    await pool.query(query, values);
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, description FROM roles');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles
};
