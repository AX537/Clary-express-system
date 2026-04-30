import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plateNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'plate_number',
    validate: {
      notEmpty: true,
      len: [3, 20]
    }
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_seats',
    validate: {
      min: 1,
      max: 100,
      isInt: true
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'company_id',
    references: {
      model: 'bus_companies',
      key: 'id'
    }
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'route_id',
    references: {
      model: 'routes',
      key: 'id'
    }
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'departure_date',
    validate: {
      isDate: true,
      notEmpty: true
    }
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'departure_time',
    validate: {
      notEmpty: true
    }
  }
  // createdAt, updatedAt, deletedAt handled automatically by Sequelize
  // via timestamps: true, paranoid: true, underscored: true below.
}, {
  tableName: 'buses',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['plate_number'] },
    { fields: ['company_id'] },
    { fields: ['route_id'] },
    { fields: ['departure_date', 'departure_time'] }
  ]
});

export default Bus;
