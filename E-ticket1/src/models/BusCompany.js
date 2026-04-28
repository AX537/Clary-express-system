import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const BusCompany = sequelize.define('BusCompany', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contact_email',
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'contact_phone',
    validate: {
      notEmpty: true,
      len: [7, 20]
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
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'bus_companies',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['contact_email']
    }
  ]
});

export default BusCompany;
