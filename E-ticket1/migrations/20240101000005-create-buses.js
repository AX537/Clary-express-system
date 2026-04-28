export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('buses', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    plate_number: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    },
    total_seats: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bus_companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    route_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    departure_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    departure_time: {
      type: Sequelize.TIME,
      allowNull: false
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
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  // Add unique index on plate_number
  await queryInterface.addIndex('buses', ['plate_number'], {
    unique: true,
    name: 'buses_plate_number_unique'
  });

  // Add index on company_id
  await queryInterface.addIndex('buses', ['company_id'], {
    name: 'buses_company_id_idx'
  });

  // Add index on route_id
  await queryInterface.addIndex('buses', ['route_id'], {
    name: 'buses_route_id_idx'
  });

  // Add composite index on departure_date and departure_time
  await queryInterface.addIndex('buses', ['departure_date', 'departure_time'], {
    name: 'buses_departure_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('buses');
}
