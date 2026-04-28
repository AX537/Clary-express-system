import { body, param } from 'express-validator';

/**
 * Validation rules for creating a booking
 */
export const createBookingValidation = [
  body('busId')
    .notEmpty().withMessage('Bus ID is required')
    .isInt({ min: 1 }).withMessage('Bus ID must be a positive integer'),
  
  body('seatNumber')
    .notEmpty().withMessage('Seat number is required')
    .isInt({ min: 1 }).withMessage('Seat number must be a positive integer')
];

/**
 * Validation rules for booking ID parameter
 */
export const bookingIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Booking ID must be a positive integer')
];
