import { body, param } from 'express-validator';

/**
 * Validation rules for creating a bus company
 */
export const createCompanyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  
  body('contactEmail')
    .trim()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('contactPhone')
    .trim()
    .notEmpty().withMessage('Contact phone is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Must be a valid phone number')
];

/**
 * Validation rules for updating a bus company
 */
export const updateCompanyValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Company ID must be a positive integer'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  
  body('contactEmail')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('contactPhone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Must be a valid phone number')
];

/**
 * Validation rules for company ID parameter
 */
export const companyIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Company ID must be a positive integer')
];
