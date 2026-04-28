import { verifyToken, extractTokenFromHeader } from '../utils/authUtils.js';
import { User, Role } from '../models/index.js';

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function authenticate(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Authentication required. No token provided.'
      });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: error.message || 'Invalid or expired token'
      });
    }
    
    // Fetch user from database to ensure they still exist and get latest role
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'User not found or has been deleted'
      });
    }
    
    // Fetch role details
    const roleDetails = await Role.findOne({
      where: { name: user.role },
      attributes: ['id', 'name', 'permissions']
    });
    
    // Parse permissions safely
    let permissions = [];
    if (roleDetails && roleDetails.permissions) {
      try {
        // If permissions is already an object/array, use it directly
        if (typeof roleDetails.permissions === 'object') {
          permissions = Array.isArray(roleDetails.permissions) ? roleDetails.permissions : [];
        } else {
          // If it's a string, try to parse it
          permissions = JSON.parse(roleDetails.permissions);
        }
      } catch (error) {
        console.error('Error parsing permissions:', error);
        permissions = [];
      }
    }
    
    // Attach user info to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleId: roleDetails ? roleDetails.id : null,
      permissions: permissions
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error during authentication'
    });
  }
}

/**
 * Optional authentication middleware - attaches user if token is present, but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }
    
    // Try to verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // Invalid token, continue without user
      req.user = null;
      return next();
    }
    
    // Fetch user from database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    
    if (user) {
      // Fetch role details
      const roleDetails = await Role.findOne({
        where: { name: user.role },
        attributes: ['id', 'name', 'permissions']
      });
      
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: roleDetails ? roleDetails.id : null,
        permissions: roleDetails ? JSON.parse(roleDetails.permissions || '[]') : []
      };
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    req.user = null;
    next();
  }
}
