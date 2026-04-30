import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isIn: [['Admin', 'Passenger', 'Driver', 'Supervisor']]
    }
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'Array of permission strings defining what actions this role can perform'
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
  tableName: 'roles',
  timestamps: true,
  underscored: true,
  paranoid: false, // Disable soft deletes for roles
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

export default Role;
