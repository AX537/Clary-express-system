export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('routes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    origin: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    destination: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    estimated_duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Estimated travel duration in minutes'
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

  // Add composite index on origin and destination
  await queryInterface.addIndex('routes', ['origin', 'destination'], {
    name: 'routes_origin_destination_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('routes');
}
