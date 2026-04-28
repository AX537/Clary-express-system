import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { updateUserValidation, userIdValidation } from '../validators/userValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All user management routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * @route   GET /admin/users
 * @desc    Get all users with pagination
 * @access  Admin only
 */
router.get('/', getAllUsers);

/**
 * @route   GET /admin/users/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get('/:id', userIdValidation, handleValidationErrors, getUserById);

/**
 * @route   PUT /admin/users/:id
 * @desc    Update user
 * @access  Admin only
 */
router.put('/:id', updateUserValidation, handleValidationErrors, updateUser);

/**
 * @route   DELETE /admin/users/:id
 * @desc    Soft delete user
 * @access  Admin only
 */
router.delete('/:id', userIdValidation, handleValidationErrors, deleteUser);

export default router;
