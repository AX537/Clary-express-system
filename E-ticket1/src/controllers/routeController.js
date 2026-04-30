import { Route } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';

/**
 * Create a new route
 * POST /admin/routes
 */
export const createRoute = asyncHandler(async (req, res) => {
  const { origin, destination, estimatedDuration, price } = req.body;

  const route = await Route.create({
    origin,
    destination,
    estimatedDuration,
    price: parseFloat(price) || 5000
  });

  res.status(201).json({
    status: 201,
    message: 'Route created successfully',
    data: { route }
  });
});

/**
 * Get all routes
 * GET /routes
 */
export const getAllRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.findAll({
    attributes: ['id', 'origin', 'destination', 'estimatedDuration', 'price', 'createdAt', 'updatedAt'],
    order: [['origin', 'ASC'], ['destination', 'ASC']]
  });

  res.status(200).json({
    status: 200,
    message: 'Routes retrieved successfully',
    data: { routes }
  });
});

/**
 * Soft delete route
 * DELETE /admin/routes/:id
 */
export const deleteRoute = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const route = await Route.findByPk(id);
  if (!route) {
    throw createError.notFound('Route not found');
  }

  await route.destroy();

  res.status(200).json({
    status: 200,
    message: 'Route deleted successfully'
  });
});
