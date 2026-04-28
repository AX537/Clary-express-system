import express from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../controllers/bookingController.js';
import { createBookingValidation, bookingIdValidation } from '../validators/bookingValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

/**
 * @route   POST /bookings
 * @desc    Create a new booking
 * @access  Authenticated users (Passenger)
 */
router.post('/', createBookingValidation, handleValidationErrors, createBooking);

/**
 * @route   GET /bookings
 * @desc    Get all bookings for the authenticated passenger
 * @access  Authenticated users (Passenger)
 */
router.get('/', getMyBookings);

/**
 * @route   GET /bookings/:id
 * @desc    Get booking by ID
 * @access  Owner, Admin, Supervisor
 */
router.get('/:id', bookingIdValidation, handleValidationErrors, getBookingById);

/**
 * @route   DELETE /bookings/:id
 * @desc    Cancel booking
 * @access  Owner only
 */
router.delete('/:id', bookingIdValidation, handleValidationErrors, cancelBooking);

export default router;
