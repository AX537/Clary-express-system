import sequelize from '../../config/database.js';
import User from './User.js';
import Role from './Role.js';
import BusCompany from './BusCompany.js';
import Route from './Route.js';
import Bus from './Bus.js';
import Seat from './Seat.js';
import Booking from './Booking.js';
import Payment from './Payment.js';
import Notification from './Notification.js';
import TravelHistory from './TravelHistory.js';

// Define associations between models

// BusCompany associations
BusCompany.hasMany(Bus, {
  foreignKey: 'companyId',
  as: 'buses',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Bus.belongsTo(BusCompany, {
  foreignKey: 'companyId',
  as: 'company'
});

// Route associations
Route.hasMany(Bus, {
  foreignKey: 'routeId',
  as: 'buses',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Bus.belongsTo(Route, {
  foreignKey: 'routeId',
  as: 'route'
});

// Bus associations
Bus.hasMany(Seat, {
  foreignKey: 'busId',
  as: 'seats',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Seat.belongsTo(Bus, {
  foreignKey: 'busId',
  as: 'bus'
});

Bus.hasMany(Booking, {
  foreignKey: 'busId',
  as: 'bookings',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Booking.belongsTo(Bus, {
  foreignKey: 'busId',
  as: 'bus'
});

Bus.hasMany(TravelHistory, {
  foreignKey: 'busId',
  as: 'travelHistories',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

TravelHistory.belongsTo(Bus, {
  foreignKey: 'busId',
  as: 'bus'
});

// User associations
User.hasMany(Booking, {
  foreignKey: 'passengerId',
  as: 'bookings',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Booking.belongsTo(User, {
  foreignKey: 'passengerId',
  as: 'passenger'
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Booking associations
Booking.hasOne(Payment, {
  foreignKey: 'bookingId',
  as: 'payment',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Payment.belongsTo(Booking, {
  foreignKey: 'bookingId',
  as: 'booking'
});

Booking.hasOne(TravelHistory, {
  foreignKey: 'bookingId',
  as: 'travelHistory',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

TravelHistory.belongsTo(Booking, {
  foreignKey: 'bookingId',
  as: 'booking'
});

// Set up default scopes for soft deletes
User.addScope('defaultScope', {
  where: { deletedAt: null }
}, { override: true });

BusCompany.addScope('defaultScope', {
  where: { deletedAt: null }
}, { override: true });

Route.addScope('defaultScope', {
  where: { deletedAt: null }
}, { override: true });

Bus.addScope('defaultScope', {
  where: { deletedAt: null }
}, { override: true });

// Export all models
export {
  sequelize,
  User,
  Role,
  BusCompany,
  Route,
  Bus,
  Seat,
  Booking,
  Payment,
  Notification,
  TravelHistory
};

// Export default object with all models
export default {
  sequelize,
  User,
  Role,
  BusCompany,
  Route,
  Bus,
  Seat,
  Booking,
  Payment,
  Notification,
  TravelHistory
};
