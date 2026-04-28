import { Booking, Bus, Seat, Payment, User, BusCompany, Route } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';
import { notifyBookingCreated } from '../services/notificationService.js';
import { Op } from 'sequelize';

/**
 * Create a new booking
 * POST /bookings
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { busId, seatNumber } = req.body;
  const passengerId = req.user.id;
  
  // Verify bus exists
  const bus = await Bus.findByPk(busId);
  if (!bus) {
    throw createError.notFound('Bus not found');
  }
  
  // Check if departure is in the past
  const departureDateTime = new Date(`${bus.departureDate}T${bus.departureTime}`);
  const now = new Date();
  
  if (departureDateTime < now) {
    throw createError.badRequest('Cannot book a bus that has already departed');
  }
  
  // Check if seat exists and is available
  const seat = await Seat.findOne({
    where: {
      busId,
      seatNumber
    }
  });
  
  if (!seat) {
    throw createError.notFound('Seat not found');
  }
  
  // Check if seat is already reserved
  const existingBooking = await Booking.findOne({
    where: {
      busId,
      seatNumber,
      status: { [Op.in]: ['pending', 'confirmed'] }
    }
  });
  
  if (existingBooking) {
    throw createError.conflict('Seat is already reserved');
  }
  
  // Create booking
  const booking = await Booking.create({
    passengerId,
    busId,
    seatNumber,
    status: 'pending'
  });
  
  // Update seat status
  seat.status = 'reserved';
  await seat.save();
  
  // Send notification
  await notifyBookingCreated(passengerId, booking.id);
  
  res.status(201).json({
    status: 201,
    message: 'Booking created successfully',
    data: { booking }
  });
});

/**
 * Get all bookings for the authenticated passenger
 * GET /bookings
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: { passengerId: req.user.id },
    include: [
      {
        model: Bus,
        as: 'bus',
        attributes: ['id', 'plateNumber', 'totalSeats', 'departureDate', 'departureTime'],
        include: [
          {
            model: BusCompany,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Route,
            as: 'route',
            attributes: ['id', 'origin', 'destination', 'estimatedDuration']
          }
        ]
      },
      {
        model: Payment,
        as: 'payment',
        attributes: ['id', 'amount', 'status', 'createdAt'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  res.status(200).json({
    status: 200,
    message: 'Bookings retrieved successfully',
    data: {
      bookings,
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
 * Get booking by ID
 * GET /bookings/:id
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: 'passenger',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Bus,
        as: 'bus',
        attributes: ['id', 'plateNumber', 'totalSeats', 'departureDate', 'departureTime'],
        include: [
          {
            model: BusCompany,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Route,
            as: 'route',
            attributes: ['id', 'origin', 'destination', 'estimatedDuration']
          }
        ]
      },
      {
        model: Payment,
        as: 'payment',
        attributes: ['id', 'amount', 'status', 'createdAt'],
        required: false
      }
    ]
  });
  
  if (!booking) {
    throw createError.notFound('Booking not found');
  }
  
  // Check access permissions
  const isOwner = booking.passengerId === req.user.id;
  const isAdmin = req.user.role === 'Admin';
  const isSupervisor = req.user.role === 'Supervisor';
  
  if (!isOwner && !isAdmin && !isSupervisor) {
    throw createError.forbidden('Access denied');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Booking retrieved successfully',
    data: { booking }
  });
});

/**
 * Cancel booking
 * DELETE /bookings/:id
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: Payment,
        as: 'payment',
        required: false
      }
    ]
  });
  
  if (!booking) {
    throw createError.notFound('Booking not found');
  }
  
  // Check if user owns the booking
  if (booking.passengerId !== req.user.id) {
    throw createError.forbidden('You can only cancel your own bookings');
  }
  
  // Check if booking is already cancelled
  if (booking.status === 'cancelled') {
    throw createError.badRequest('Booking is already cancelled');
  }
  
  // Update booking status
  booking.status = 'cancelled';
  await booking.save();
  
  // Free up the seat
  const seat = await Seat.findOne({
    where: {
      busId: booking.busId,
      seatNumber: booking.seatNumber
    }
  });
  
  if (seat) {
    seat.status = 'available';
    await seat.save();
  }
  
  // If payment was completed, mark for refund
  if (booking.payment && booking.payment.status === 'completed') {
    booking.payment.status = 'refund_pending';
    await booking.payment.save();
  }
  
  res.status(200).json({
    status: 200,
    message: 'Booking cancelled successfully',
    data: {
      booking: {
        id: booking.id,
        status: booking.status,
        refundStatus: booking.payment ? booking.payment.status : null
      }
    }
  });
});
