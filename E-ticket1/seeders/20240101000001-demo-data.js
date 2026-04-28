import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
  
  // Hash passwords
  const adminPassword = await bcrypt.hash('password123', 10);
  const passengerPassword = await bcrypt.hash('passenger123', 10);
  const driverPassword = await bcrypt.hash('driver123', 10);
  const supervisorPassword = await bcrypt.hash('supervisor123', 10);

  // 1. Insert roles (check if they exist first to make seeder idempotent)
  const existingRoles = await queryInterface.sequelize.query(
    'SELECT name FROM roles WHERE name IN ("Admin", "Passenger", "Driver", "Supervisor")',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  const existingRoleNames = existingRoles.map(r => r.name);
  const rolesToInsert = [];
  
  if (!existingRoleNames.includes('Admin')) {
    rolesToInsert.push({
      name: 'Admin',
      permissions: JSON.stringify([
        'manage_users',
        'manage_companies',
        'manage_routes',
        'manage_buses',
        'view_all_bookings',
        'view_all_payments',
        'view_travel_history'
      ]),
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingRoleNames.includes('Passenger')) {
    rolesToInsert.push({
      name: 'Passenger',
      permissions: JSON.stringify([
        'search_buses',
        'view_seats',
        'create_booking',
        'view_own_bookings',
        'cancel_own_booking',
        'initiate_payment',
        'verify_payment',
        'view_own_notifications'
      ]),
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingRoleNames.includes('Driver')) {
    rolesToInsert.push({
      name: 'Driver',
      permissions: JSON.stringify([
        'view_assigned_schedule',
        'view_assigned_travel_history'
      ]),
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingRoleNames.includes('Supervisor')) {
    rolesToInsert.push({
      name: 'Supervisor',
      permissions: JSON.stringify([
        'view_bus_bookings',
        'view_bus_travel_history',
        'view_bus_operations'
      ]),
      created_at: now,
      updated_at: now
    });
  }
  
  if (rolesToInsert.length > 0) {
    await queryInterface.bulkInsert('roles', rolesToInsert, {});
  }

  // Get role IDs
  const roles = await queryInterface.sequelize.query(
    'SELECT id, name FROM roles WHERE name IN ("Admin", "Passenger", "Driver", "Supervisor")',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.name] = role.id;
  });

  // 2. Insert users (check if they exist first)
  const existingUsers = await queryInterface.sequelize.query(
    'SELECT email FROM users WHERE email IN ("admin@example.com", "passenger@example.com", "driver@example.com", "supervisor@example.com")',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  const existingEmails = existingUsers.map(u => u.email);
  const usersToInsert = [];
  
  if (!existingEmails.includes('admin@example.com')) {
    usersToInsert.push({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: roleMap['Admin'],
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingEmails.includes('passenger@example.com')) {
    usersToInsert.push({
      name: 'John Passenger',
      email: 'passenger@example.com',
      password: passengerPassword,
      role: roleMap['Passenger'],
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingEmails.includes('driver@example.com')) {
    usersToInsert.push({
      name: 'Mike Driver',
      email: 'driver@example.com',
      password: driverPassword,
      role: roleMap['Driver'],
      created_at: now,
      updated_at: now
    });
  }
  
  if (!existingEmails.includes('supervisor@example.com')) {
    usersToInsert.push({
      name: 'Sarah Supervisor',
      email: 'supervisor@example.com',
      password: supervisorPassword,
      role: roleMap['Supervisor'],
      created_at: now,
      updated_at: now
    });
  }
  
  if (usersToInsert.length > 0) {
    await queryInterface.bulkInsert('users', usersToInsert, {});
  }

  // 3. Insert bus company (check if exists)
  const existingCompanies = await queryInterface.sequelize.query(
    'SELECT name FROM bus_companies WHERE name = "Metro Express"',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  let companyId;
  if (existingCompanies.length === 0) {
    await queryInterface.bulkInsert('bus_companies', [{
      name: 'Metro Express',
      contact_email: 'info@metroexpress.com',
      contact_phone: '+254700123456',
      created_at: now,
      updated_at: now
    }], {});
    
    const companies = await queryInterface.sequelize.query(
      'SELECT id FROM bus_companies WHERE name = "Metro Express"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    companyId = companies[0].id;
  } else {
    const companies = await queryInterface.sequelize.query(
      'SELECT id FROM bus_companies WHERE name = "Metro Express"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    companyId = companies[0].id;
  }

  // 4. Insert route (check if exists)
  const existingRoutes = await queryInterface.sequelize.query(
    'SELECT id FROM routes WHERE origin = "Nairobi" AND destination = "Mombasa"',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  let routeId;
  if (existingRoutes.length === 0) {
    await queryInterface.bulkInsert('routes', [{
      origin: 'Nairobi',
      destination: 'Mombasa',
      estimated_duration: 480, // 8 hours in minutes
      created_at: now,
      updated_at: now
    }], {});
    
    const routes = await queryInterface.sequelize.query(
      'SELECT id FROM routes WHERE origin = "Nairobi" AND destination = "Mombasa"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    routeId = routes[0].id;
  } else {
    routeId = existingRoutes[0].id;
  }

  // 5. Insert bus (check if exists)
  const existingBuses = await queryInterface.sequelize.query(
    'SELECT id FROM buses WHERE plate_number = "KBZ-123A"',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  let busId;
  if (existingBuses.length === 0) {
    await queryInterface.bulkInsert('buses', [{
      plate_number: 'KBZ-123A',
      total_seats: 40,
      company_id: companyId,
      route_id: routeId,
      departure_date: futureDate.toISOString().split('T')[0],
      departure_time: '08:00:00',
      created_at: now,
      updated_at: now
    }], {});
    
    const buses = await queryInterface.sequelize.query(
      'SELECT id FROM buses WHERE plate_number = "KBZ-123A"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    busId = buses[0].id;
  } else {
    busId = existingBuses[0].id;
  }

  // 6. Insert seats for the bus (check if they exist)
  const existingSeats = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM seats WHERE bus_id = ?',
    { 
      replacements: [busId],
      type: Sequelize.QueryTypes.SELECT 
    }
  );
  
  if (existingSeats[0].count === 0) {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      seats.push({
        bus_id: busId,
        seat_number: i,
        status: 'available',
        created_at: now,
        updated_at: now
      });
    }
    await queryInterface.bulkInsert('seats', seats, {});
  }

  console.log('✓ Demo data seeded successfully');
  console.log('  - Roles: Admin, Passenger, Driver, Supervisor');
  console.log('  - Users:');
  console.log('    • Admin: admin@example.com / password123');
  console.log('    • Passenger: passenger@example.com / passenger123');
  console.log('    • Driver: driver@example.com / driver123');
  console.log('    • Supervisor: supervisor@example.com / supervisor123');
  console.log('  - Bus Company: Metro Express');
  console.log('  - Route: Nairobi → Mombasa (480 min)');
  console.log('  - Bus: KBZ-123A (40 seats, departure in 7 days at 08:00)');
}

export async function down(queryInterface, Sequelize) {
  // Delete in reverse order of dependencies
  await queryInterface.bulkDelete('seats', { bus_id: { [Sequelize.Op.ne]: null } }, {});
  await queryInterface.bulkDelete('buses', { plate_number: 'KBZ-123A' }, {});
  await queryInterface.bulkDelete('routes', { 
    origin: 'Nairobi',
    destination: 'Mombasa'
  }, {});
  await queryInterface.bulkDelete('bus_companies', { name: 'Metro Express' }, {});
  await queryInterface.bulkDelete('users', {
    email: {
      [Sequelize.Op.in]: [
        'admin@example.com',
        'passenger@example.com',
        'driver@example.com',
        'supervisor@example.com'
      ]
    }
  }, {});
  // Note: We don't delete roles as they might be referenced by other data
  
  console.log('✓ Demo data removed successfully');
}
