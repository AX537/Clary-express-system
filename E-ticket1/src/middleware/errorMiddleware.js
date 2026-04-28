/**
 * Global error handling middleware
 * Catches all errors and returns a consistent JSON response
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function errorHandler(err, req, res, next) {
  // Log the full error stack trace for debugging
  console.error('Error occurred:');
  console.error('Path:', req.method, req.path);
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Determine error message
  let message = 'Internal server error';
  
  if (statusCode !== 500) {
    // For non-500 errors, use the error message
    message = err.message || message;
  } else if (process.env.NODE_ENV === 'development') {
    // In development, show the actual error message
    message = err.message || message;
  }
  
  // Build error response
  const errorResponse = {
    status: statusCode,
    message: message
  };
  
  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.error = err.toString();
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 * Catches all requests that don't match any route
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    status: 404,
    message: `Route ${req.method} ${req.path} not found`
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass them to error middleware
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Helper function to create common errors
 */
export const createError = {
  badRequest: (message = 'Bad request') => new AppError(message, 400),
  unauthorized: (message = 'Unauthorized') => new AppError(message, 401),
  forbidden: (message = 'Forbidden') => new AppError(message, 403),
  notFound: (message = 'Resource not found') => new AppError(message, 404),
  conflict: (message = 'Conflict') => new AppError(message, 409),
  internal: (message = 'Internal server error') => new AppError(message, 500)
};
