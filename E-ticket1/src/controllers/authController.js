import { User } from '../models/index.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/authUtils.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';

/**
 * Register a new user
 * POST /auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  
  if (existingUser) {
    throw createError.conflict('User with this email already exists');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'Passenger' // Default to Passenger if not specified
  });
  
  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });
  
  // Return user data (excluding password) and token
  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    }
  });
});

/**
 * Login user
 * POST /auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email (including soft-deleted users to give proper error message)
  const user = await User.findOne({ 
    where: { email },
    paranoid: false // Include soft-deleted users
  });
  
  if (!user) {
    throw createError.unauthorized('Invalid email or password');
  }
  
  // Check if user is soft-deleted
  if (user.deletedAt) {
    throw createError.unauthorized('This account has been deactivated');
  }
  
  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    throw createError.unauthorized('Invalid email or password');
  }
  
  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });
  
  // Return user data (excluding password) and token
  res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

/**
 * Get current user profile
 * GET /auth/me
 */
export const getProfile = asyncHandler(async (req, res) => {
  // User is already attached to req by authenticate middleware
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
  });
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});
