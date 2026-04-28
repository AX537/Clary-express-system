import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator
 * Returns a 400 response with detailed error messages if validation fails
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors into a more readable structure
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
}
