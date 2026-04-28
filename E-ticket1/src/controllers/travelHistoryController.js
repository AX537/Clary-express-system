import { TravelHistory, Booking, Bus, Route, User, BusCompany } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';

/**
 * Get travel history (Driver and Supervisor only)
 * GET /travel-history
 */
export const getTravelHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  // Build query based on role
  let whereClause = {};
  
  // For Driver and Supervisor roles, filter by buses they're associated with
  // Note: This assumes there's a relationship between users and buses
  // For now, we'll show all travel history for these roles
  // In a real system, you'd filter by assigned buses
  
  const { count, rows: travelHistories } = await TravelHistory.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'passengerId', 'seatNumber', 'status'],
        include: [
          {
            model: User,
            as: 'passenger',
            attributes: ['id', 'name', 'email']
          }
        ]
      },
      {
        model: Bus,
        as: 'bus',
        attributes: ['id', 'plateNumber', 'departureDate', 'departureTime'],
        include: [
          {
            model: Route,
            as: 'route',
            attributes: ['id', 'origin', 'destination', 'estimatedDuration']
          },
          {
            model: BusCompany,
            as: 'company',
            attributes: ['id', 'name']
          }
        ]
      }
    ],
    order: [['completedAt', 'DESC']],
    limit,
    offset
  });
  
  res.status(200).json({
    status: 200,
    message: 'Travel history retrieved successfully',
    data: {
      travelHistories,
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
 * Get travel history by ID
 * GET /travel-history/:id
 */
export const getTravelHistoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const travelHistory = await TravelHistory.findByPk(id, {
    include: [
      {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'passengerId', 'seatNumber', 'status', 'createdAt'],
        include: [
          {
            model: User,
            as: 'passenger',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      },
      {
        model: Bus,
        as: 'bus',
        attributes: ['id', 'plateNumber', 'totalSeats', 'departureDate', 'departureTime'],
        include: [
          {
            model: Route,
            as: 'route',
            attributes: ['id', 'origin', 'destination', 'estimatedDuration']
          },
          {
            model: BusCompany,
            as: 'company',
            attributes: ['id', 'name', 'contactEmail', 'contactPhone']
          }
        ]
      }
    ]
  });
  
  if (!travelHistory) {
    throw createError.notFound('Travel history not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Travel history retrieved successfully',
    data: {
      travelHistory
    }
  });
});
