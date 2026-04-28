export async function up(queryInterface, Sequelize) {
  const now = new Date();
  
  await queryInterface.bulkInsert('roles', [
    {
      name: 'Admin',
      permissions: '["manage_users","manage_companies","manage_routes","manage_buses","view_all_bookings","view_all_payments","view_travel_history"]',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Passenger',
      permissions: '["search_buses","view_seats","create_booking","view_own_bookings","cancel_own_booking","initiate_payment","verify_payment","view_own_notifications"]',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Driver',
      permissions: '["view_assigned_schedule","view_assigned_travel_history"]',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Supervisor',
      permissions: '["view_bus_bookings","view_bus_travel_history","view_bus_operations"]',
      created_at: now,
      updated_at: now
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', {
    name: {
      [Sequelize.Op.in]: ['Admin', 'Passenger', 'Driver', 'Supervisor']
    }
  }, {});
}
