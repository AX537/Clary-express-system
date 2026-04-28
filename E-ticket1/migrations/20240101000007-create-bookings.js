export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('bookings', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    passenger_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    seat_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
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

  // Add index on passenger_id
  await queryInterface.addIndex('bookings', ['passenger_id'], {
    name: 'bookings_passenger_id_idx'
  });

  // Add index on bus_id
  await queryInterface.addIndex('bookings', ['bus_id'], {
    name: 'bookings_bus_id_idx'
  });

  // Add composite index on bus_id and seat_number
  await queryInterface.addIndex('bookings', ['bus_id', 'seat_number'], {
    name: 'bookings_bus_id_seat_number_idx'
  });

  // Add index on status
  await queryInterface.addIndex('bookings', ['status'], {
    name: 'bookings_status_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('bookings');
}
