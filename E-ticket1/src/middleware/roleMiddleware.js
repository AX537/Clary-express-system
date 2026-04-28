/**
 * Role-based access control middleware
 * Checks if the authenticated user has one of the required roles
 * 
 * @param {string|string[]} allowedRoles - Single role or array of roles allowed to access the route
 * @returns {Function} Express middleware function
 */
export function requireRole(allowedRoles) {
  // Normalize to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Authentication required'
      });
    }
    
    // Check if user has one of the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    // User has required role, proceed
    next();
  };
}

/**
 * Check if user has a specific permission
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions required
 * @returns {Function} Express middleware function
 */
export function requirePermission(requiredPermissions) {
  // Normalize to array
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Authentication required'
      });
    }
    
    // Admin has all permissions
    if (req.user.role === 'Admin') {
      return next();
    }
    
    // Check if user has at least one of the required permissions
    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some(perm => userPermissions.includes(perm));
    
    if (!hasPermission) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. Required permission not found.'
      });
    }
    
    // User has required permission, proceed
    next();
  };
}

/**
 * Middleware to check if user is Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      message: 'Access denied. Admin role required.'
    });
  }
  
  next();
}

/**
 * Middleware to check if user is Passenger
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requirePassenger(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'Passenger' && req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      message: 'Access denied. Passenger role required.'
    });
  }
  
  next();
}

/**
 * Middleware to check if user is Driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requireDriver(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'Driver' && req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      message: 'Access denied. Driver role required.'
    });
  }
  
  next();
}

/**
 * Middleware to check if user is Supervisor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requireSupervisor(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'Supervisor' && req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      message: 'Access denied. Supervisor role required.'
    });
  }
  
  next();
}

/**
 * Middleware to check if user owns a resource
 * Useful for endpoints where users can only access their own data
 * 
 * @param {string} userIdField - Field name in req.params or req.body that contains the user ID to check
 * @returns {Function} Express middleware function
 */
export function requireOwnership(userIdField = 'userId') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Authentication required'
      });
    }
    
    // Admin can access any resource
    if (req.user.role === 'Admin') {
      return next();
    }
    
    // Get the user ID from params or body
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (!resourceUserId) {
      return res.status(400).json({
        status: 400,
        message: `Missing ${userIdField} in request`
      });
    }
    
    // Check if the authenticated user owns the resource
    if (parseInt(resourceUserId) !== req.user.id) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. You can only access your own resources.'
      });
    }
    
    next();
  };
}
