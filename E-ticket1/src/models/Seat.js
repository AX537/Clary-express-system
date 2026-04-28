import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.ENUM('available', 'reserved'),
    allowNull: false,
    defaultValue: 'available',
    validate: {
      isIn: [['available', 'reserved']]
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
  tableName: 'seats',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['bus_id', 'seat_number']
    },
    {
      fields: ['bus_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default Seat;
