import express from 'express';
import { getTravelHistory, getTravelHistoryById } from '../controllers/travelHistoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All travel history routes require authentication
router.use(authenticate);

/**
 * @route   GET /travel-history
 * @desc    Get travel history (Driver and Supervisor only)
 * @access  Driver, Supervisor
 */
router.get('/', requireRole(['Driver', 'Supervisor']), getTravelHistory);

/**
 * @route   GET /travel-history/:id
 * @desc    Get travel history by ID
 * @access  Driver, Supervisor
 */
router.get(
  '/:id',
  requireRole(['Driver', 'Supervisor']),
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Travel history ID must be a positive integer')
  ],
  handleValidationErrors,
  getTravelHistoryById
);

export default router;
