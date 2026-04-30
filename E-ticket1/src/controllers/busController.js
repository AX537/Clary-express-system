import { Bus, Seat, BusCompany, Route, Booking } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';
import { Op } from 'sequelize';
import sequelize from '../../config/database.js';

/**
 * Create a new bus with seats
 * POST /admin/buses
 */
export const createBus = asyncHandler(async (req, res) => {
  const { plateNumber, totalSeats, companyId, routeId, departureDate, departureTime } = req.body;

  const existingBus = await Bus.findOne({ where: { plateNumber } });
  if (existingBus) throw createError.conflict('Bus with this plate number already exists');

  const company = await BusCompany.findByPk(companyId);
  if (!company) throw createError.notFound('Bus company not found');

  const route = await Route.findByPk(routeId);
  if (!route) throw createError.notFound('Route not found');

  const bus = await Bus.create({ plateNumber, totalSeats, companyId, routeId, departureDate, departureTime });

  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    seats.push({ busId: bus.id, seatNumber: i, status: 'available' });
  }
  await Seat.bulkCreate(seats);

  res.status(201).json({
    status: 201,
    message: 'Bus created successfully with seats',
    data: { bus, seatsCreated: totalSeats }
  });
});

/**
 * Get all buses with pagination
 * GET /admin/buses
 */
export const getAllBuses = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: buses } = await Bus.findAndCountAll({
    include: [
      { model: BusCompany, as: 'company', attributes: ['id', 'name'] },
      { model: Route,      as: 'route',   attributes: ['id', 'origin', 'destination', 'estimatedDuration'] },
      { model: Seat,       as: 'seats',   attributes: ['status'], required: false }
    ],
    limit,
    offset,
    order: [['departureDate', 'ASC'], ['departureTime', 'ASC']]
  });

  const busesWithAvailability = buses.map(bus => {
    const busData = bus.toJSON();
    const availableSeats = busData.seats ? busData.seats.filter(s => s.status === 'available').length : 0;
    delete busData.seats;
    return { ...busData, availableSeats };
  });

  res.status(200).json({
    status: 200,
    message: 'Buses retrieved successfully',
    data: {
      buses: busesWithAvailability,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
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
  if (!bus) throw createError.notFound('Bus not found');

  if (plateNumber && plateNumber !== bus.plateNumber) {
    const existingBus = await Bus.findOne({ where: { plateNumber } });
    if (existingBus) throw createError.conflict('Plate number is already taken');
  }

  if (companyId && companyId !== bus.companyId) {
    const company = await BusCompany.findByPk(companyId);
    if (!company) throw createError.notFound('Bus company not found');
  }

  if (routeId && routeId !== bus.routeId) {
    const route = await Route.findByPk(routeId);
    if (!route) throw createError.notFound('Route not found');
  }

  if (plateNumber)    bus.plateNumber    = plateNumber;
  if (companyId)      bus.companyId      = companyId;
  if (routeId)        bus.routeId        = routeId;
  if (departureDate)  bus.departureDate  = departureDate;
  if (departureTime)  bus.departureTime  = departureTime;

  if (totalSeats && totalSeats !== bus.totalSeats) {
    const currentSeats = await Seat.count({ where: { busId: bus.id } });
    if (totalSeats > currentSeats) {
      const newSeats = [];
      for (let i = currentSeats + 1; i <= totalSeats; i++) {
        newSeats.push({ busId: bus.id, seatNumber: i, status: 'available' });
      }
      await Seat.bulkCreate(newSeats);
    } else if (totalSeats < currentSeats) {
      const seatsToRemove = await Seat.findAll({ where: { busId: bus.id, seatNumber: { [Op.gt]: totalSeats } } });
      const reservedSeats = seatsToRemove.filter(s => s.status === 'reserved');
      if (reservedSeats.length > 0) throw createError.badRequest('Cannot reduce seat count below reserved seats');
      await Seat.destroy({ where: { busId: bus.id, seatNumber: { [Op.gt]: totalSeats } } });
    }
    bus.totalSeats = totalSeats;
  }

  await bus.save();
  res.status(200).json({ status: 200, message: 'Bus updated successfully', data: { bus } });
});

/**
 * Soft delete bus and cancel pending bookings
 * DELETE /admin/buses/:id
 */
export const deleteBus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bus = await Bus.findByPk(id);
  if (!bus) throw createError.notFound('Bus not found');

  await Booking.update(
    { status: 'cancelled' },
    { where: { busId: id, status: { [Op.in]: ['pending', 'confirmed'] } } }
  );

  await bus.destroy();
  res.status(200).json({ status: 200, message: 'Bus deleted successfully and pending bookings cancelled' });
});

/**
 * Search buses by origin, destination, and date
 * GET /buses/search
 * Fixed: case-insensitive search for origin and destination
 */
export const searchBuses = asyncHandler(async (req, res) => {
  const { origin, destination, date } = req.query;

  // Build date filter - if date provided use exact match, otherwise return all future buses
  const today = new Date().toISOString().split('T')[0];
  const dateFilter = date ? { departureDate: date } : { departureDate: { [Op.gte]: today } };

  const buses = await Bus.findAll({
    include: [
      { model: BusCompany, as: 'company', attributes: ['id', 'name'] },
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'origin', 'destination', 'estimatedDuration', 'price'],
        where: {
          // Fixed: case-insensitive search using LOWER()
          origin:      sequelize.where(sequelize.fn('LOWER', sequelize.col('route.origin')),      origin.toLowerCase()),
          destination: sequelize.where(sequelize.fn('LOWER', sequelize.col('route.destination')), destination.toLowerCase())
        }
      },
      { model: Seat, as: 'seats', attributes: ['status'], required: false }
    ],
    where: dateFilter,
    order: [['departureDate', 'ASC'], ['departureTime', 'ASC']]
  });

  const busesWithAvailability = buses.map(bus => {
    const busData = bus.toJSON();
    const availableSeats = busData.seats ? busData.seats.filter(s => s.status === 'available').length : 0;
    delete busData.seats;
    return { ...busData, availableSeats };
  });

  res.status(200).json({
    status: 200,
    message: 'Buses retrieved successfully',
    data: {
      buses: busesWithAvailability,
      searchCriteria: { origin, destination, date: date || "all future dates" }
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
  if (!bus) throw createError.notFound('Bus not found');

  const seats = await Seat.findAll({
    where: { busId: id },
    attributes: ['id', 'seatNumber', 'status'],
    order: [['seatNumber', 'ASC']]
  });

  res.status(200).json({
    status: 200,
    message: 'Seat availability retrieved successfully',
    data: { busId: bus.id, plateNumber: bus.plateNumber, totalSeats: bus.totalSeats, seats }
  });
});
