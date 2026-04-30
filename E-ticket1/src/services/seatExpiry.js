import { Booking, Seat } from '../models/index.js';
import { Op } from 'sequelize';

const EXPIRY_MINUTES = 10; // Seats held for 10 minutes before auto-release

/**
 * Cancel expired pending bookings and release their seats
 * Runs every minute via setInterval
 */
export const cancelExpiredBookings = async () => {
  try {
    const expiryTime = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

    // Find all pending bookings older than EXPIRY_MINUTES
    const expiredBookings = await Booking.findAll({
      where: {
        status: 'pending',
        createdAt: { [Op.lt]: expiryTime }
      }
    });

    if (expiredBookings.length === 0) return;

    console.log(`[Seat Expiry] Found ${expiredBookings.length} expired booking(s) — releasing seats...`);

    for (const booking of expiredBookings) {
      // Cancel the booking
      booking.status = 'cancelled';
      await booking.save();

      // Release the seat
      await Seat.update(
        { status: 'available' },
        {
          where: {
            busId: booking.busId,
            seatNumber: booking.seatNumber
          }
        }
      );

      console.log(`[Seat Expiry] Booking #${booking.id} cancelled — Seat ${booking.seatNumber} on Bus ${booking.busId} released`);
    }
  } catch (error) {
    console.error('[Seat Expiry] Error:', error.message);
  }
};

/**
 * Start the seat expiry scheduler
 * @param {number} intervalMs - How often to check (default: every 60 seconds)
 */
export const startSeatExpiryScheduler = (intervalMs = 60 * 1000) => {
  console.log(`[Seat Expiry] Scheduler started — checking every ${intervalMs / 1000}s, expiry: ${EXPIRY_MINUTES} minutes`);

  // Run immediately on startup
  cancelExpiredBookings();

  // Then run on interval
  setInterval(cancelExpiredBookings, intervalMs);
};
