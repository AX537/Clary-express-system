import { body, param } from 'express-validator';

/**
 * Validation rules for creating a route
 */
export const createRouteValidation = [
  body('origin')
    .trim()
    .notEmpty().withMessage('Origin is required')
    .isLength({ min: 2, max: 100 }).withMessage('Origin must be between 2 and 100 characters'),
  
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination is required')
    .isLength({ min: 2, max: 100 }).withMessage('Destination must be between 2 and 100 characters')
    .custom((value, { req }) => {
      if (value === req.body.origin) {
        throw new Error('Destination cannot be the same as origin');
      }
      return true;
    }),
  
  body('estimatedDuration')
    .notEmpty().withMessage('Estimated duration is required')
    .isInt({ min: 1 }).withMessage('Estimated duration must be a positive integer (minutes)')
];

/**
 * Validation rules for route ID parameter
 */
export const routeIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Route ID must be a positive integer')
];
