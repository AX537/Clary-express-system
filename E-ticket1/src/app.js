import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { sequelize, testConnection } from '../config/database.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import busRoutes from './routes/busRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import travelHistoryRoutes from './routes/travelHistoryRoutes.js';
import swaggerRoutes from './routes/swaggerRoutes.js';

// Middleware imports
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { startSeatExpiryScheduler } from './services/seatExpiry.js';

// Load environment variables
dotenv.config();

// Get current file path for ES6 modules
const __filename = fileURLToPath(import.meta.url);

// Create Express application
const app = express();

// Middleware configuration
// CORS - Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging with morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'E-Ticketing System API is running',
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use('/auth', authRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/companies', companyRoutes);
app.use('/routes', routeRoutes);
app.use('/admin/routes', routeRoutes);
app.use('/buses', busRoutes);
app.use('/admin/buses', busRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/travel-history', travelHistoryRoutes);
app.use('/api-docs', swaggerRoutes);

// 404 Handler - Must be after all valid routes
app.use(notFoundHandler);

// Global Error Handler - Must be last middleware
app.use(errorHandler);

// Server startup function
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database models (in development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('[OK] Database models synchronized');
    }

    // Start seat expiry scheduler — releases unpaid seats after 10 minutes
    startSeatExpiryScheduler();

    // Start listening
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`[OK] Server is running on port ${PORT}`);
      console.log(`[OK] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[OK] Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Always start the server when this file is run directly
startServer();

// Export app for testing
export default app;
