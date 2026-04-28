import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  messageType: {
    type: DataTypes.ENUM('booking_created', 'payment_confirmed', 'payment_failed', 'booking_cancelled'),
    allowNull: false,
    field: 'message_type',
    validate: {
      isIn: [['booking_created', 'payment_confirmed', 'payment_failed', 'booking_cancelled']]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read'
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
  tableName: 'notifications',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Notification;
