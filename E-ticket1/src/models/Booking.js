import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  passengerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'passenger_id',
    references: {
      model: 'users',
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
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seat_number',
    validate: {
      min: 1,
      isInt: true
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'confirmed', 'cancelled']]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['passenger_id']
    },
    {
      fields: ['bus_id']
    },
    {
      fields: ['bus_id', 'seat_number']
    },
    {
      fields: ['status']
    }
  ]
});

export default Booking;
