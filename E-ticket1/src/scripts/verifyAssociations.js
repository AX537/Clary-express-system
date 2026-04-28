import { 
  User, 
  Role, 
  BusCompany, 
  Route, 
  Bus, 
  Seat, 
  Booking, 
  Payment, 
  Notification, 
  TravelHistory 
} from '../models/index.js';

console.log('=== Model Associations Verification ===\n');

// Helper function to display association details
function displayAssociation(model, associationName) {
  const assoc = model.associations[associationName];
  if (assoc) {
    console.log(`✓ ${model.name}.${associationName}:`);
    console.log(`  Type: ${assoc.associationType}`);
    console.log(`  Target: ${assoc.target.name}`);
    console.log(`  Foreign Key: ${assoc.foreignKey}`);
    if (assoc.options.onDelete) {
      console.log(`  onDelete: ${assoc.options.onDelete}`);
    }
    if (assoc.options.onUpdate) {
      console.log(`  onUpdate: ${assoc.options.onUpdate}`);
    }
  } else {
    console.log(`✗ ${model.name}.${associationName}: NOT FOUND`);
  }
  console.log();
}

// Helper function to display unique constraints
function displayUniqueConstraints(model, fieldName) {
  const field = model.rawAttributes[fieldName];
  if (field && field.unique) {
    console.log(`✓ ${model.name}.${fieldName}: UNIQUE`);
  } else {
    console.log(`✗ ${model.name}.${fieldName}: NOT UNIQUE`);
  }
}

// Helper function to display composite indexes
function displayCompositeIndex(model, fields) {
  const indexes = model.options.indexes || [];
  const compositeIndex = indexes.find(idx => 
    idx.unique && 
    fields.every(field => idx.fields.includes(field))
  );
  if (compositeIndex) {
    console.log(`✓ ${model.name} has composite unique index on [${fields.join(', ')}]`);
  } else {
    console.log(`✗ ${model.name} missing composite unique index on [${fields.join(', ')}]`);
  }
}

console.log('--- BusCompany Associations ---');
displayAssociation(BusCompany, 'buses');

console.log('--- Route Associations ---');
displayAssociation(Route, 'buses');

console.log('--- Bus Associations ---');
displayAssociation(Bus, 'company');
displayAssociation(Bus, 'route');
displayAssociation(Bus, 'seats');
displayAssociation(Bus, 'bookings');
displayAssociation(Bus, 'travelHistories');

console.log('--- User Associations ---');
displayAssociation(User, 'bookings');
displayAssociation(User, 'notifications');

console.log('--- Booking Associations ---');
displayAssociation(Booking, 'passenger');
displayAssociation(Booking, 'bus');
displayAssociation(Booking, 'payment');
displayAssociation(Booking, 'travelHistory');

console.log('--- Payment Associations ---');
displayAssociation(Payment, 'booking');

console.log('--- Notification Associations ---');
displayAssociation(Notification, 'user');

console.log('--- TravelHistory Associations ---');
displayAssociation(TravelHistory, 'booking');
displayAssociation(TravelHistory, 'bus');

console.log('--- Seat Associations ---');
displayAssociation(Seat, 'bus');

console.log('\n=== Unique Constraints Verification ===\n');
displayUniqueConstraints(User, 'email');
displayUniqueConstraints(BusCompany, 'name');
displayUniqueConstraints(Bus, 'plateNumber');
displayUniqueConstraints(Role, 'name');
displayCompositeIndex(Seat, ['bus_id', 'seat_number']);

console.log('\n=== Soft Delete (Paranoid) Verification ===\n');
console.log(`User paranoid: ${User.options.paranoid ? '✓' : '✗'}`);
console.log(`BusCompany paranoid: ${BusCompany.options.paranoid ? '✓' : '✗'}`);
console.log(`Route paranoid: ${Route.options.paranoid ? '✓' : '✗'}`);
console.log(`Bus paranoid: ${Bus.options.paranoid ? '✓' : '✗'}`);
console.log(`Seat paranoid: ${Seat.options.paranoid ? '✗ (expected)' : '✓ (expected)'}`);
console.log(`Booking paranoid: ${Booking.options.paranoid ? '✗ (expected)' : '✓ (expected)'}`);
console.log(`Payment paranoid: ${Payment.options.paranoid ? '✗ (expected)' : '✓ (expected)'}`);
console.log(`Notification paranoid: ${Notification.options.paranoid ? '✗ (expected)' : '✓ (expected)'}`);
console.log(`TravelHistory paranoid: ${TravelHistory.options.paranoid ? '✗ (expected)' : '✓ (expected)'}`);

console.log('\n=== Verification Complete ===');
