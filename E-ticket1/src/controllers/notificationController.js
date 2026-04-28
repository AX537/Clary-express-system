import { Notification } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';

/**
 * Get all notifications for the authenticated user
 * GET /notifications
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  // Get notifications ordered by creation date (newest first)
  const { count, rows: notifications } = await Notification.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    attributes: ['id', 'messageType', 'message', 'isRead', 'createdAt', 'updatedAt']
  });
  
  res.status(200).json({
    status: 200,
    message: 'Notifications retrieved successfully',
    data: {
      notifications,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * Mark notification as read
 * PATCH /notifications/:id/read
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Find notification
  const notification = await Notification.findByPk(id);
  
  if (!notification) {
    throw createError.notFound('Notification not found');
  }
  
  // Check ownership
  if (notification.userId !== userId) {
    throw createError.forbidden('You can only mark your own notifications as read');
  }
  
  // Check if already read
  if (notification.isRead) {
    return res.status(200).json({
      status: 200,
      message: 'Notification already marked as read',
      data: {
        notification: {
          id: notification.id,
          isRead: notification.isRead,
          updatedAt: notification.updatedAt
        }
      }
    });
  }
  
  // Mark as read
  notification.isRead = true;
  await notification.save();
  
  res.status(200).json({
    status: 200,
    message: 'Notification marked as read',
    data: {
      notification: {
        id: notification.id,
        isRead: notification.isRead,
        updatedAt: notification.updatedAt
      }
    }
  });
});
