import { body, param } from 'express-validator';

export const createRouteValidation = [
  body('origin')
    .trim()
    .notEmpty().withMessage('Origin is required')
    .isLength({ min: 2, max: 100 }).withMessage('Origin must be between 2 and 100 characters'),

  body('destination')
    .trim()
    .notEmpty().withMessage('Destination is required')
    .isLength({ min: 2, max: 100 }).withMessage('Destination must be between 2 and 100 characters'),

  body('estimatedDuration')
    .notEmpty().withMessage('Estimated duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid number')
    .custom(val => parseFloat(val) >= 0).withMessage('Price must be 0 or greater')
];

export const updateRouteValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Route ID must be a positive integer'),

  body('origin')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Origin must be between 2 and 100 characters'),

  body('destination')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Destination must be between 2 and 100 characters'),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)'),

  body('price')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid number')
    .custom(val => parseFloat(val) >= 0).withMessage('Price must be 0 or greater')
];

export const routeIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Route ID must be a positive integer')
];
