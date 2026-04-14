const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Verify token
    const result = await authService.verifyToken(token);
    
    if (!result.success) {
      return res.status(401).json({ 
        success: false, 
        message: result.message 
      });
    }

    // Attach user to request
    req.user = result.data;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. No role found.' 
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

const hasPermission = (permissionName) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. No permissions found.' 
      });
    }

    if (!req.user.permissions.includes(permissionName)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required permission: ${permissionName}` 
      });
    }

    next();
  };
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, hasPermission, validate };
