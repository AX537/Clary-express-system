import { User, Role, BusCompany, Route, Bus, Seat, Booking, Payment, Notification, TravelHistory } from '../models/index.js';

console.log('Verifying Sequelize Models...\n');

// User Model
console.log('✓ User Model:');
console.log(`  - Table: ${User.tableName}`);
console.log(`  - Paranoid: ${User.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(User.rawAttributes).join(', ')}`);

// Role Model
console.log('\n✓ Role Model:');
console.log(`  - Table: ${Role.tableName}`);
console.log(`  - Fields: ${Object.keys(Role.rawAttributes).join(', ')}`);

// BusCompany Model
console.log('\n✓ BusCompany Model:');
console.log(`  - Table: ${BusCompany.tableName}`);
console.log(`  - Paranoid: ${BusCompany.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(BusCompany.rawAttributes).join(', ')}`);

// Route Model
console.log('\n✓ Route Model:');
console.log(`  - Table: ${Route.tableName}`);
console.log(`  - Paranoid: ${Route.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Route.rawAttributes).join(', ')}`);

// Bus Model
console.log('\n✓ Bus Model:');
console.log(`  - Table: ${Bus.tableName}`);
console.log(`  - Paranoid: ${Bus.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Bus.rawAttributes).join(', ')}`);

// Seat Model
console.log('\n✓ Seat Model:');
console.log(`  - Table: ${Seat.tableName}`);
console.log(`  - Paranoid: ${Seat.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Seat.rawAttributes).join(', ')}`);

// Booking Model
console.log('\n✓ Booking Model:');
console.log(`  - Table: ${Booking.tableName}`);
console.log(`  - Paranoid: ${Booking.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Booking.rawAttributes).join(', ')}`);

// Payment Model
console.log('\n✓ Payment Model:');
console.log(`  - Table: ${Payment.tableName}`);
console.log(`  - Paranoid: ${Payment.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Payment.rawAttributes).join(', ')}`);

// Notification Model
console.log('\n✓ Notification Model:');
console.log(`  - Table: ${Notification.tableName}`);
console.log(`  - Paranoid: ${Notification.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(Notification.rawAttributes).join(', ')}`);

// TravelHistory Model
console.log('\n✓ TravelHistory Model:');
console.log(`  - Table: ${TravelHistory.tableName}`);
console.log(`  - Paranoid: ${TravelHistory.options.paranoid}`);
console.log(`  - Fields: ${Object.keys(TravelHistory.rawAttributes).join(', ')}`);

console.log('\n✓ All models loaded successfully!');
