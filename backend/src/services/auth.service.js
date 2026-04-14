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
}

module.exports = new AuthService();
