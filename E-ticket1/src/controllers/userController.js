import { User } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';
import { hashPassword } from '../utils/authUtils.js';

/**
 * Get all users with pagination
 * GET /admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const { count, rows: users } = await User.findAndCountAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  res.status(200).json({
    status: 200,
    message: 'Users retrieved successfully',
    data: {
      users,
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
 * Get user by ID
 * GET /admin/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
  });
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'User retrieved successfully',
    data: { user }
  });
});

/**
 * Update user
 * PUT /admin/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  
  const user = await User.findByPk(id);
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError.conflict('Email is already taken');
    }
  }
  
  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  
  await user.save();
  
  res.status(200).json({
    status: 200,
    message: 'User updated successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    }
  });
});

/**
 * Soft delete user
 * DELETE /admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findByPk(id);
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  // Prevent admin from deleting themselves
  if (user.id === req.user.id) {
    throw createError.badRequest('You cannot delete your own account');
  }
  
  // Soft delete (sets deletedAt timestamp)
  await user.destroy();
  
  res.status(200).json({
    status: 200,
    message: 'User deleted successfully'
  });
});
