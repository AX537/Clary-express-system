import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'estimated_duration',
    validate: {
      min: 1,
      isInt: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5000.00,
    validate: {
      min: 0,
      isDecimal: true
    }
  }
}, {
  tableName: 'routes',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['origin', 'destination'],
      name: 'routes_origin_destination_idx'
    }
  ]
});

export default Route;
