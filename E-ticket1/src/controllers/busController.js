import { Bus, Seat, BusCompany, Route, Booking } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';
import { Op } from 'sequelize';

/**
 * Create a new bus with seats
 * POST /admin/buses
 */
export const createBus = asyncHandler(async (req, res) => {
  const { plateNumber, totalSeats, companyId, routeId, departureDate, departureTime } = req.body;
  
  // Check if bus with same plate number already exists
  const existingBus = await Bus.findOne({ where: { plateNumber } });
  
  if (existingBus) {
    throw createError.conflict('Bus with this plate number already exists');
  }
  
  // Verify company exists
  const company = await BusCompany.findByPk(companyId);
  if (!company) {
    throw createError.notFound('Bus company not found');
  }
  
  // Verify route exists
  const route = await Route.findByPk(routeId);
  if (!route) {
    throw createError.notFound('Route not found');
  }
  
  // Create bus
  const bus = await Bus.create({
    plateNumber,
    totalSeats,
    companyId,
    routeId,
    departureDate,
    departureTime
  });
  
  // Auto-generate seats for the bus
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    seats.push({
      busId: bus.id,
      seatNumber: i,
      status: 'available'
    });
  }
  
  await Seat.bulkCreate(seats);
  
  res.status(201).json({
    status: 201,
    message: 'Bus created successfully with seats',
    data: { 
      bus,
      seatsCreated: totalSeats
    }
  });
});

/**
 * Get all buses with pagination
 * GET /admin/buses
 */
export const getAllBuses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const { count, rows: buses } = await Bus.findAndCountAll({
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
      },
      {
        model: Seat,
        as: 'seats',
        attributes: ['status'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['departureDate', 'ASC'], ['departureTime', 'ASC']]
  });
  
  // Calculate available seats for each bus
  const busesWithAvailability = buses.map(bus => {
    const busData = bus.toJSON();
    const availableSeats = busData.seats ? busData.seats.filter(s => s.status === 'available').length : 0;
    delete busData.seats; // Remove seats array from response
    return {
      ...busData,
      availableSeats
    };
  });
  
  res.status(200).json({
    status: 200,
    message: 'Buses retrieved successfully',
    data: {
      buses: busesWithAvailability,
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
 * Update bus
 * PUT /admin/buses/:id
 */
export const updateBus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { plateNumber, totalSeats, companyId, routeId, departureDate, departureTime } = req.body;
  
  const bus = await Bus.findByPk(id);
  
  if (!bus) {
    throw createError.notFound('Bus not found');
  }
  
  // Check if plate number is being changed and if it's already taken
  if (plateNumber && plateNumber !== bus.plateNumber) {
    const existingBus = await Bus.findOne({ where: { plateNumber } });
    if (existingBus) {
      throw createError.conflict('Plate number is already taken');
    }
  }
  
  // Verify company exists if being changed
  if (companyId && companyId !== bus.companyId) {
    const company = await BusCompany.findByPk(companyId);
    if (!company) {
      throw createError.notFound('Bus company not found');
    }
  }
  
  // Verify route exists if being changed
  if (routeId && routeId !== bus.routeId) {
    const route = await Route.findByPk(routeId);
    if (!route) {
      throw createError.notFound('Route not found');
    }
  }
  
  // Update bus fields
  if (plateNumber) bus.plateNumber = plateNumber;
  if (companyId) bus.companyId = companyId;
  if (routeId) bus.routeId = routeId;
  if (departureDate) bus.departureDate = departureDate;
  if (departureTime) bus.departureTime = departureTime;
  
  // Handle seat count change
  if (totalSeats && totalSeats !== bus.totalSeats) {
    const currentSeats = await Seat.count({ where: { busId: bus.id } });
    
    if (totalSeats > currentSeats) {
      // Add more seats
      const newSeats = [];
      for (let i = currentSeats + 1; i <= totalSeats; i++) {
        newSeats.push({
          busId: bus.id,
          seatNumber: i,
          status: 'available'
        });
      }
      await Seat.bulkCreate(newSeats);
    } else if (totalSeats < currentSeats) {
      // Remove excess seats (only if they're not booked)
      const seatsToRemove = await Seat.findAll({
        where: {
          busId: bus.id,
          seatNumber: { [Op.gt]: totalSeats }
        }
      });
      
      // Check if any of these seats are reserved
      const reservedSeats = seatsToRemove.filter(s => s.status === 'reserved');
      if (reservedSeats.length > 0) {
        throw createError.badRequest('Cannot reduce seat count below reserved seats');
      }
      
      await Seat.destroy({
        where: {
          busId: bus.id,
          seatNumber: { [Op.gt]: totalSeats }
        }
      });
    }
    
    bus.totalSeats = totalSeats;
  }
  
  await bus.save();
  
  res.status(200).json({
    status: 200,
    message: 'Bus updated successfully',
    data: { bus }
  });
});

/**
 * Soft delete bus and cancel pending bookings
 * DELETE /admin/buses/:id
 */
export const deleteBus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const bus = await Bus.findByPk(id);
  
  if (!bus) {
    throw createError.notFound('Bus not found');
  }
  
  // Cancel all pending bookings for this bus
  await Booking.update(
    { status: 'cancelled' },
    {
      where: {
        busId: id,
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    }
  );
  
  // Soft delete bus (sets deletedAt timestamp)
  await bus.destroy();
  
  res.status(200).json({
    status: 200,
    message: 'Bus deleted successfully and pending bookings cancelled'
  });
});

/**
 * Search buses by origin, destination, and date
 * GET /buses/search
 */
export const searchBuses = asyncHandler(async (req, res) => {
  const { origin, destination, date } = req.query;
  
  const buses = await Bus.findAll({
    include: [
      {
        model: BusCompany,
        as: 'company',
        attributes: ['id', 'name']
      },
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'origin', 'destination', 'estimatedDuration'],
        where: {
          origin,
          destination
        }
      },
      {
        model: Seat,
        as: 'seats',
        attributes: ['status'],
        required: false
      }
    ],
    where: {
      departureDate: date
    },
    order: [['departureTime', 'ASC']]
  });
  
  // Calculate available seats for each bus
  const busesWithAvailability = buses.map(bus => {
    const busData = bus.toJSON();
    const availableSeats = busData.seats ? busData.seats.filter(s => s.status === 'available').length : 0;
    delete busData.seats; // Remove seats array from response
    return {
      ...busData,
      availableSeats
    };
  });
  
  res.status(200).json({
    status: 200,
    message: 'Buses retrieved successfully',
    data: {
      buses: busesWithAvailability,
      searchCriteria: { origin, destination, date }
    }
  });
});

/**
 * Get seat availability for a specific bus
 * GET /buses/:id/seats
 */
export const getBusSeats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const bus = await Bus.findByPk(id);
  
  if (!bus) {
    throw createError.notFound('Bus not found');
  }
  
  const seats = await Seat.findAll({
    where: { busId: id },
    attributes: ['id', 'seatNumber', 'status'],
    order: [['seatNumber', 'ASC']]
  });
  
  res.status(200).json({
    status: 200,
    message: 'Seat availability retrieved successfully',
    data: {
      busId: bus.id,
      plateNumber: bus.plateNumber,
      totalSeats: bus.totalSeats,
      seats
    }
  });
});
