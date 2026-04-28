import { body, param } from 'express-validator';

/**
 * Validation rules for updating a user
 */
export const updateUserValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['Admin', 'Passenger', 'Driver', 'Supervisor']).withMessage('Invalid role')
];

/**
 * Validation rules for user ID parameter
 */
export const userIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
];
