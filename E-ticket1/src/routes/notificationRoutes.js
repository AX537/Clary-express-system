import express from 'express';
import { getMyNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * @route   GET /notifications
 * @desc    Get all notifications for the authenticated user
 * @access  Authenticated users
 */
router.get('/', getMyNotifications);

/**
 * @route   PATCH /notifications/:id/read
 * @desc    Mark notification as read
 * @access  Owner only
 */
router.patch(
  '/:id/read',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Notification ID must be a positive integer')
  ],
  handleValidationErrors,
  markNotificationAsRead
);

export default router;
