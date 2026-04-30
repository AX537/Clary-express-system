export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('routes', 'price', {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5000.00,
    comment: 'Ticket price in RWF'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('routes', 'price');
}
