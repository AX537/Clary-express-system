import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const TravelHistory = sequelize.define('TravelHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'booking_id',
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  busId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'bus_id',
    references: {
      model: 'buses',
      key: 'id'
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'completed_at'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  }
}, {
  tableName: 'travel_history',
  timestamps: true,
  updatedAt: false,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['booking_id']
    },
    {
      fields: ['bus_id']
    },
    {
      fields: ['completed_at']
    }
  ]
});

export default TravelHistory;
