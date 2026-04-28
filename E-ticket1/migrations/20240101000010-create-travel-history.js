export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('travel_history', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    bus_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    completed_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Add index on booking_id
  await queryInterface.addIndex('travel_history', ['booking_id'], {
    name: 'travel_history_booking_id_idx'
  });

  // Add index on bus_id
  await queryInterface.addIndex('travel_history', ['bus_id'], {
    name: 'travel_history_bus_id_idx'
  });

  // Add index on completed_at
  await queryInterface.addIndex('travel_history', ['completed_at'], {
    name: 'travel_history_completed_at_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('travel_history');
}
