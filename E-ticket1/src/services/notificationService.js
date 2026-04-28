import { Notification } from '../models/index.js';

/**
 * Notification Service
 * Handles creation of notifications for various events
 */

/**
 * Create a notification for a user
 * @param {number} userId - User ID
 * @param {string} messageType - Type of notification
 * @param {string} message - Notification message
 */
export async function createNotification(userId, messageType, message) {
  try {
    await Notification.create({
      userId,
      messageType,
      message,
      isRead: false
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw error - notifications are non-critical
  }
}

/**
 * Create booking created notification
 * @param {number} userId - User ID
 * @param {number} bookingId - Booking ID
 */
export async function notifyBookingCreated(userId, bookingId) {
  await createNotification(
    userId,
    'booking_created',
    `Your booking #${bookingId} has been created successfully. Please complete payment to confirm.`
  );
}

/**
 * Create payment confirmed notification
 * @param {number} userId - User ID
 * @param {number} bookingId - Booking ID
 */
export async function notifyPaymentConfirmed(userId, bookingId) {
  await createNotification(
    userId,
    'payment_confirmed',
    `Payment for booking #${bookingId} has been confirmed. Your seat is now reserved.`
  );
}

/**
 * Create payment failed notification
 * @param {number} userId - User ID
 * @param {number} bookingId - Booking ID
 */
export async function notifyPaymentFailed(userId, bookingId) {
  await createNotification(
    userId,
    'payment_failed',
    `Payment for booking #${bookingId} has failed. Please try again.`
  );
}

/**
 * Create booking cancelled notification
 * @param {number} userId - User ID
 * @param {number} bookingId - Booking ID
 * @param {string} reason - Cancellation reason
 */
export async function notifyBookingCancelled(userId, bookingId, reason = 'Bus schedule changed') {
  await createNotification(
    userId,
    'booking_cancelled',
    `Your booking #${bookingId} has been cancelled. Reason: ${reason}`
  );
}
