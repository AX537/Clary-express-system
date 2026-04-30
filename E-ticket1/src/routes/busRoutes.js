import express from 'express';
import {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
  searchBuses,
  getBusSeats
} from '../controllers/busController.js';
import {
  createBusValidation,
  updateBusValidation,
  busIdValidation,
  busSearchValidation
} from '../validators/busValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /buses/search
 * @desc    Search buses by origin, destination, and date
 * @access  Public - Fixed: removed authenticate so guests can search buses
 */
router.get('/search', busSearchValidation, handleValidationErrors, searchBuses);

/**
 * @route   GET /buses/:id/seats
 * @desc    Get seat availability for a specific bus
 * @access  Public - guests can view seats before logging in
 */
router.get('/:id/seats', busIdValidation, handleValidationErrors, getBusSeats);

/**
 * @route   POST /admin/buses
 * @desc    Create a new bus with seats
 * @access  Admin only
 */
router.post('/', authenticate, requireAdmin, createBusValidation, handleValidationErrors, createBus);

/**
 * @route   GET /admin/buses
 * @desc    Get all buses with pagination
 * @access  Admin only
 */
router.get('/', authenticate, requireAdmin, getAllBuses);

/**
 * @route   PUT /admin/buses/:id
 * @desc    Update bus
 * @access  Admin only
 */
router.put('/:id', authenticate, requireAdmin, updateBusValidation, handleValidationErrors, updateBus);

/**
 * @route   DELETE /admin/buses/:id
 * @desc    Soft delete bus and cancel pending bookings
 * @access  Admin only
 */
router.delete('/:id', authenticate, requireAdmin, busIdValidation, handleValidationErrors, deleteBus);

export default router;
