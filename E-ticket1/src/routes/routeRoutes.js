import express from 'express';
import { createRoute, getAllRoutes, deleteRoute } from '../controllers/routeController.js';
import { createRouteValidation, routeIdValidation } from '../validators/routeValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   POST /admin/routes
 * @desc    Create a new route
 * @access  Admin only
 */
router.post('/', authenticate, requireAdmin, createRouteValidation, handleValidationErrors, createRoute);

/**
 * @route   GET /routes
 * @desc    Get all routes
 * @access  All authenticated users
 */
router.get('/', authenticate, getAllRoutes);

/**
 * @route   DELETE /admin/routes/:id
 * @desc    Soft delete route
 * @access  Admin only
 */
router.delete('/:id', authenticate, requireAdmin, routeIdValidation, handleValidationErrors, deleteRoute);

export default router;
