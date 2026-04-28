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
      notEmpty: true,
      len: [2, 100]
    }
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'estimated_duration',
    validate: {
      min: 1,
      isInt: true
    },
    comment: 'Estimated travel duration in minutes'
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
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'routes',
  timestamps: true,
  paranoid: true,
  underscored: true,
  validate: {
    originNotEqualDestination() {
      if (this.origin === this.destination) {
        throw new Error('Origin and destination cannot be the same');
      }
    }
  },
  indexes: [
    {
      fields: ['origin', 'destination']
    }
  ]
});

export default Route;
