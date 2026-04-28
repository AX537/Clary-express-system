export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notifications', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    message_type: {
      type: Sequelize.ENUM('booking_created', 'payment_confirmed', 'payment_failed', 'booking_cancelled'),
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  // Add index on user_id
  await queryInterface.addIndex('notifications', ['user_id'], {
    name: 'notifications_user_id_idx'
  });

  // Add index on is_read
  await queryInterface.addIndex('notifications', ['is_read'], {
    name: 'notifications_is_read_idx'
  });

  // Add index on created_at
  await queryInterface.addIndex('notifications', ['created_at'], {
    name: 'notifications_created_at_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('notifications');
}
