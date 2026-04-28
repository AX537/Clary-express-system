import { User, BusCompany, Route, Bus, Seat, Booking, Payment, Notification, TravelHistory } from '../src/models/index.js';

describe('Model Associations', () => {

  describe('BusCompany associations', () => {
    test('BusCompany should have buses association', () => {
      expect(BusCompany.associations.buses).toBeDefined();
      expect(BusCompany.associations.buses.associationType).toBe('HasMany');
    });

    test('Bus should belong to BusCompany', () => {
      expect(Bus.associations.company).toBeDefined();
      expect(Bus.associations.company.associationType).toBe('BelongsTo');
    });
  });

  describe('Route associations', () => {
    test('Route should have buses association', () => {
      expect(Route.associations.buses).toBeDefined();
      expect(Route.associations.buses.associationType).toBe('HasMany');
    });

    test('Bus should belong to Route', () => {
      expect(Bus.associations.route).toBeDefined();
      expect(Bus.associations.route.associationType).toBe('BelongsTo');
    });
  });

  describe('Bus associations', () => {
    test('Bus should have seats association', () => {
      expect(Bus.associations.seats).toBeDefined();
      expect(Bus.associations.seats.associationType).toBe('HasMany');
    });

    test('Seat should belong to Bus', () => {
      expect(Seat.associations.bus).toBeDefined();
      expect(Seat.associations.bus.associationType).toBe('BelongsTo');
    });

    test('Bus should have bookings association', () => {
      expect(Bus.associations.bookings).toBeDefined();
      expect(Bus.associations.bookings.associationType).toBe('HasMany');
    });

    test('Booking should belong to Bus', () => {
      expect(Booking.associations.bus).toBeDefined();
      expect(Booking.associations.bus.associationType).toBe('BelongsTo');
    });

    test('Bus should have travelHistories association', () => {
      expect(Bus.associations.travelHistories).toBeDefined();
      expect(Bus.associations.travelHistories.associationType).toBe('HasMany');
    });

    test('TravelHistory should belong to Bus', () => {
      expect(TravelHistory.associations.bus).toBeDefined();
      expect(TravelHistory.associations.bus.associationType).toBe('BelongsTo');
    });
  });

  describe('User associations', () => {
    test('User should have bookings association', () => {
      expect(User.associations.bookings).toBeDefined();
      expect(User.associations.bookings.associationType).toBe('HasMany');
    });

    test('Booking should belong to User as passenger', () => {
      expect(Booking.associations.passenger).toBeDefined();
      expect(Booking.associations.passenger.associationType).toBe('BelongsTo');
    });

    test('User should have notifications association', () => {
      expect(User.associations.notifications).toBeDefined();
      expect(User.associations.notifications.associationType).toBe('HasMany');
    });

    test('Notification should belong to User', () => {
      expect(Notification.associations.user).toBeDefined();
      expect(Notification.associations.user.associationType).toBe('BelongsTo');
    });
  });

  describe('Booking associations', () => {
    test('Booking should have payment association', () => {
      expect(Booking.associations.payment).toBeDefined();
      expect(Booking.associations.payment.associationType).toBe('HasOne');
    });

    test('Payment should belong to Booking', () => {
      expect(Payment.associations.booking).toBeDefined();
      expect(Payment.associations.booking.associationType).toBe('BelongsTo');
    });

    test('Booking should have travelHistory association', () => {
      expect(Booking.associations.travelHistory).toBeDefined();
      expect(Booking.associations.travelHistory.associationType).toBe('HasOne');
    });

    test('TravelHistory should belong to Booking', () => {
      expect(TravelHistory.associations.booking).toBeDefined();
      expect(TravelHistory.associations.booking.associationType).toBe('BelongsTo');
    });
  });

  describe('Unique constraints', () => {
    test('User model should have unique email constraint', () => {
      const emailField = User.rawAttributes.email;
      expect(emailField.unique).toBe(true);
    });

    test('BusCompany model should have unique name constraint', () => {
      const nameField = BusCompany.rawAttributes.name;
      expect(nameField.unique).toBe(true);
    });

    test('Bus model should have unique plateNumber constraint', () => {
      const plateNumberField = Bus.rawAttributes.plateNumber;
      expect(plateNumberField.unique).toBe(true);
    });

    test('Seat model should have composite unique constraint on busId and seatNumber', () => {
      const indexes = Seat.options.indexes;
      const compositeIndex = indexes.find(idx => 
        idx.unique && 
        idx.fields.includes('bus_id') && 
        idx.fields.includes('seat_number')
      );
      expect(compositeIndex).toBeDefined();
    });
  });

  describe('Soft delete scopes', () => {
    test('User should have paranoid enabled', () => {
      expect(User.options.paranoid).toBe(true);
    });

    test('BusCompany should have paranoid enabled', () => {
      expect(BusCompany.options.paranoid).toBe(true);
    });

    test('Route should have paranoid enabled', () => {
      expect(Route.options.paranoid).toBe(true);
    });

    test('Bus should have paranoid enabled', () => {
      expect(Bus.options.paranoid).toBe(true);
    });

    test('Seat should not have paranoid enabled', () => {
      expect(Seat.options.paranoid).toBe(false);
    });

    test('Booking should not have paranoid enabled', () => {
      expect(Booking.options.paranoid).toBe(false);
    });

    test('Payment should not have paranoid enabled', () => {
      expect(Payment.options.paranoid).toBe(false);
    });

    test('Notification should not have paranoid enabled', () => {
      expect(Notification.options.paranoid).toBe(false);
    });

    test('TravelHistory should not have paranoid enabled', () => {
      expect(TravelHistory.options.paranoid).toBe(false);
    });
  });

  describe('Foreign key constraints', () => {
    test('Bus should have foreign key to BusCompany', () => {
      const companyIdField = Bus.rawAttributes.companyId;
      expect(companyIdField.references).toBeDefined();
      expect(companyIdField.references.model).toBe('bus_companies');
      expect(companyIdField.references.key).toBe('id');
    });

    test('Bus should have foreign key to Route', () => {
      const routeIdField = Bus.rawAttributes.routeId;
      expect(routeIdField.references).toBeDefined();
      expect(routeIdField.references.model).toBe('routes');
      expect(routeIdField.references.key).toBe('id');
    });

    test('Seat should have foreign key to Bus', () => {
      const busIdField = Seat.rawAttributes.busId;
      expect(busIdField.references).toBeDefined();
      expect(busIdField.references.model).toBe('buses');
      expect(busIdField.references.key).toBe('id');
    });

    test('Booking should have foreign key to User', () => {
      const passengerIdField = Booking.rawAttributes.passengerId;
      expect(passengerIdField.references).toBeDefined();
      expect(passengerIdField.references.model).toBe('users');
      expect(passengerIdField.references.key).toBe('id');
    });

    test('Booking should have foreign key to Bus', () => {
      const busIdField = Booking.rawAttributes.busId;
      expect(busIdField.references).toBeDefined();
      expect(busIdField.references.model).toBe('buses');
      expect(busIdField.references.key).toBe('id');
    });

    test('Payment should have foreign key to Booking', () => {
      const bookingIdField = Payment.rawAttributes.bookingId;
      expect(bookingIdField.references).toBeDefined();
      expect(bookingIdField.references.model).toBe('bookings');
      expect(bookingIdField.references.key).toBe('id');
    });

    test('Notification should have foreign key to User', () => {
      const userIdField = Notification.rawAttributes.userId;
      expect(userIdField.references).toBeDefined();
      expect(userIdField.references.model).toBe('users');
      expect(userIdField.references.key).toBe('id');
    });

    test('TravelHistory should have foreign key to Booking', () => {
      const bookingIdField = TravelHistory.rawAttributes.bookingId;
      expect(bookingIdField.references).toBeDefined();
      expect(bookingIdField.references.model).toBe('bookings');
      expect(bookingIdField.references.key).toBe('id');
    });

    test('TravelHistory should have foreign key to Bus', () => {
      const busIdField = TravelHistory.rawAttributes.busId;
      expect(busIdField.references).toBeDefined();
      expect(busIdField.references.model).toBe('buses');
      expect(busIdField.references.key).toBe('id');
    });
  });

  describe('Cascade delete behaviors', () => {
    test('Bus to Seat should cascade on delete', () => {
      const association = Bus.associations.seats;
      expect(association.options.onDelete).toBe('CASCADE');
    });

    test('User to Notification should cascade on delete', () => {
      const association = User.associations.notifications;
      expect(association.options.onDelete).toBe('CASCADE');
    });

    test('BusCompany to Bus should restrict on delete', () => {
      const association = BusCompany.associations.buses;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('Route to Bus should restrict on delete', () => {
      const association = Route.associations.buses;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('Bus to Booking should restrict on delete', () => {
      const association = Bus.associations.bookings;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('User to Booking should restrict on delete', () => {
      const association = User.associations.bookings;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('Booking to Payment should restrict on delete', () => {
      const association = Booking.associations.payment;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('Booking to TravelHistory should restrict on delete', () => {
      const association = Booking.associations.travelHistory;
      expect(association.options.onDelete).toBe('RESTRICT');
    });

    test('Bus to TravelHistory should restrict on delete', () => {
      const association = Bus.associations.travelHistories;
      expect(association.options.onDelete).toBe('RESTRICT');
    });
  });
});
