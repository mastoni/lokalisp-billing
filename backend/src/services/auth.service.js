const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = 10;

class AuthService {
  async login(username, password) {
    // Find user by username or email
    const user = await userModel.findByUsername(username) || 
                 await userModel.findByEmail(username);

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Get user permissions
    const permissions = await userModel.getUserPermissions(user.role_id);

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
      permissions: permissions.map(p => p.name),
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Update last login
    await userModel.updateLastLogin(user.id);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await userModel.createSession(user.id, token, expiresAt);

    // Prepare user data (without password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role_name,
      role_description: user.role_description,
      permissions: permissions.map(p => ({
        name: p.name,
        description: p.description,
        resource: p.resource,
        action: p.action,
      })),
    };

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
        expiresIn: JWT_EXPIRES_IN,
      },
    };
  }

  async register(userData) {
    // Check if username or email already exists
    const existingUser = await userModel.findByUsername(userData.username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const existingEmail = await userModel.findByEmail(userData.email);
    if (existingEmail) {
      return { success: false, message: 'Email already exists' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Get role ID
    const roleQuery = 'SELECT id FROM roles WHERE name = $1';
    const { Pool } = require('pg');
    const pool = require('../config/database');
    const roleResult = await pool.query(roleQuery, [userData.role || 'customer']);
    
    if (roleResult.rows.length === 0) {
      return { success: false, message: 'Invalid role' };
    }

    const roleId = roleResult.rows[0].id;

    // Create user
    const newUser = await userModel.create({
      username: userData.username,
      email: userData.email,
      passwordHash,
      fullName: userData.fullName,
      phone: userData.phone,
      roleId,
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        role: userData.role || 'customer',
      },
    };
  }

  async logout(userId) {
    await userModel.deleteSession(userId);
    return { success: true, message: 'Logout successful' };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const session = await userModel.findSession(token);
      
      if (!session) {
        return { success: false, message: 'Invalid or expired token' };
      }

      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token' };
    }
  }

  async getMe(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const permissions = await userModel.getUserPermissions(user.role_id);

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role_name,
        role_description: user.role_description,
        permissions: permissions.map(p => ({
          name: p.name,
          description: p.description,
          resource: p.resource,
          action: p.action,
        })),
      },
    };
  }

  async forgotPassword(emailOrUsername) {
    const user = await userModel.findByEmail(emailOrUsername) || 
                 await userModel.findByUsername(emailOrUsername);

    if (!user) {
      return { 
        success: true, 
        message: 'If an account exists with that email, we will send a reset link.' 
      };
    }

    // Generate random token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Store in database
    const db = require('../config/database');
    await db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // MOCK EMAIL LOGIC
    console.log(`[PASS_RESET] Token for ${user.email}: ${token}`);
    console.log(`URL: http://localhost:3000/reset-password?token=${token}`);

    return { 
      success: true, 
      message: 'If an account exists with that email, we will send a reset link.' 
    };
  }

  async resetPassword(token, newPassword) {
    const db = require('../config/database');
    
    // Find reset record and user
    const res = await db.query(
      `SELECT r.user_id, r.expires_at, u.username 
       FROM password_resets r 
       JOIN users u ON u.id = r.user_id 
       WHERE r.token = $1 AND r.used = false`,
      [token]
    );

    if (res.rows.length === 0) {
      return { success: false, message: 'Invalid or expired token' };
    }

    const { user_id, expires_at } = res.rows[0];

    // Check expiration
    if (new Date() > new Date(expires_at)) {
      return { success: false, message: 'Token has expired' };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update user and mark token as used
    await db.query('BEGIN');
    try {
      await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user_id]);
      await db.query('UPDATE password_resets SET used = true WHERE token = $1', [token]);
      await db.query('COMMIT');
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }

    return { success: true, message: 'Password has been reset successfully' };
  }
}

module.exports = new AuthService();
