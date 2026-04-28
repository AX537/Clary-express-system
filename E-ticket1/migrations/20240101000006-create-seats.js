export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('seats', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bus_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    seat_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('available', 'reserved'),
      allowNull: false,
      defaultValue: 'available'
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

  // Add unique composite index on bus_id and seat_number
  await queryInterface.addIndex('seats', ['bus_id', 'seat_number'], {
    unique: true,
    name: 'seats_bus_id_seat_number_unique'
  });

  // Add index on bus_id
  await queryInterface.addIndex('seats', ['bus_id'], {
    name: 'seats_bus_id_idx'
  });

  // Add index on status
  await queryInterface.addIndex('seats', ['status'], {
    name: 'seats_status_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('seats');
}
