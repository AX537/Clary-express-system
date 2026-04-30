import { body, query, param } from 'express-validator';

/**
 * Validation rules for bus search
 */
export const busSearchValidation = [
  query('origin')
    .trim()
    .notEmpty().withMessage('Origin is required'),

  query('destination')
    .trim()
    .notEmpty().withMessage('Destination is required'),

  query('date')
    .optional() // Made optional - defaults to today on frontend
    .isDate().withMessage('Must be a valid date (YYYY-MM-DD)')
];

/**
 * Validation rules for creating a bus
 */
export const createBusValidation = [
  body('plateNumber')
    .trim()
    .notEmpty().withMessage('Plate number is required')
    .isLength({ min: 3, max: 20 }).withMessage('Plate number must be between 3 and 20 characters'),

  body('totalSeats')
    .notEmpty().withMessage('Total seats is required')
    .isInt({ min: 1, max: 100 }).withMessage('Total seats must be between 1 and 100'),

  body('companyId')
    .notEmpty().withMessage('Company ID is required')
    .isInt({ min: 1 }).withMessage('Company ID must be a positive integer'),

  body('routeId')
    .notEmpty().withMessage('Route ID is required')
    .isInt({ min: 1 }).withMessage('Route ID must be a positive integer'),

  body('departureDate')
    .notEmpty().withMessage('Departure date is required')
    .isDate().withMessage('Must be a valid date (YYYY-MM-DD)'),

  body('departureTime')
    .notEmpty().withMessage('Departure time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Must be a valid time (HH:MM:SS)')
];

/**
 * Validation rules for updating a bus
 */
export const updateBusValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Bus ID must be a positive integer'),

  body('plateNumber')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Plate number must be between 3 and 20 characters'),

  body('totalSeats')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Total seats must be between 1 and 100'),

  body('companyId')
    .optional()
    .isInt({ min: 1 }).withMessage('Company ID must be a positive integer'),

  body('routeId')
    .optional()
    .isInt({ min: 1 }).withMessage('Route ID must be a positive integer'),

  body('departureDate')
    .optional()
    .isDate().withMessage('Must be a valid date (YYYY-MM-DD)'),

  body('departureTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Must be a valid time (HH:MM:SS)')
];

/**
 * Validation rules for bus ID parameter
 */
export const busIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Bus ID must be a positive integer')
];
