import { sequelize, User, Role, BusCompany, Route, Bus, Seat, Booking, Payment, Notification, TravelHistory } from '../src/models/index.js';

describe('Sequelize Models', () => {
  beforeAll(async () => {
    // Test database connection
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User Model', () => {
    test('should be defined', () => {
      expect(User).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(User.tableName).toBe('users');
    });

    test('should have required fields', () => {
      const attributes = User.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.name).toBeDefined();
      expect(attributes.email).toBeDefined();
      expect(attributes.password).toBeDefined();
      expect(attributes.role).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
    });

    test('should have email as unique field', () => {
      const attributes = User.rawAttributes;
      expect(attributes.email.unique).toBe(true);
    });

    test('should have paranoid mode enabled', () => {
      expect(User.options.paranoid).toBe(true);
    });
  });

  describe('Role Model', () => {
    test('should be defined', () => {
      expect(Role).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Role.tableName).toBe('roles');
    });

    test('should have required fields', () => {
      const attributes = Role.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.name).toBeDefined();
      expect(attributes.permissions).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
    });

    test('should have name as unique field', () => {
      const attributes = Role.rawAttributes;
      expect(attributes.name.unique).toBe(true);
    });
  });

  describe('BusCompany Model', () => {
    test('should be defined', () => {
      expect(BusCompany).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(BusCompany.tableName).toBe('bus_companies');
    });

    test('should have required fields', () => {
      const attributes = BusCompany.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.name).toBeDefined();
      expect(attributes.contactEmail).toBeDefined();
      expect(attributes.contactPhone).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
    });

    test('should have name as unique field', () => {
      const attributes = BusCompany.rawAttributes;
      expect(attributes.name.unique).toBe(true);
    });

    test('should have paranoid mode enabled', () => {
      expect(BusCompany.options.paranoid).toBe(true);
    });
  });

  describe('Route Model', () => {
    test('should be defined', () => {
      expect(Route).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Route.tableName).toBe('routes');
    });

    test('should have required fields', () => {
      const attributes = Route.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.origin).toBeDefined();
      expect(attributes.destination).toBeDefined();
      expect(attributes.estimatedDuration).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
    });

    test('should have paranoid mode enabled', () => {
      expect(Route.options.paranoid).toBe(true);
    });
  });

  describe('Bus Model', () => {
    test('should be defined', () => {
      expect(Bus).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Bus.tableName).toBe('buses');
    });

    test('should have required fields', () => {
      const attributes = Bus.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.plateNumber).toBeDefined();
      expect(attributes.totalSeats).toBeDefined();
      expect(attributes.companyId).toBeDefined();
      expect(attributes.routeId).toBeDefined();
      expect(attributes.departureDate).toBeDefined();
      expect(attributes.departureTime).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
    });

    test('should have plateNumber as unique field', () => {
      const attributes = Bus.rawAttributes;
      expect(attributes.plateNumber.unique).toBe(true);
    });

    test('should have paranoid mode enabled', () => {
      expect(Bus.options.paranoid).toBe(true);
    });

    test('should have foreign key references', () => {
      const attributes = Bus.rawAttributes;
      expect(attributes.companyId.references).toBeDefined();
      expect(attributes.companyId.references.model).toBe('bus_companies');
      expect(attributes.routeId.references).toBeDefined();
      expect(attributes.routeId.references.model).toBe('routes');
    });
  });

  describe('Seat Model', () => {
    test('should be defined', () => {
      expect(Seat).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Seat.tableName).toBe('seats');
    });

    test('should have required fields', () => {
      const attributes = Seat.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.busId).toBeDefined();
      expect(attributes.seatNumber).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
    });

    test('should have paranoid mode disabled', () => {
      expect(Seat.options.paranoid).toBe(false);
    });

    test('should have status ENUM with correct values', () => {
      const attributes = Seat.rawAttributes;
      expect(attributes.status.type.values).toEqual(['available', 'reserved']);
    });

    test('should have foreign key reference to buses', () => {
      const attributes = Seat.rawAttributes;
      expect(attributes.busId.references).toBeDefined();
      expect(attributes.busId.references.model).toBe('buses');
    });
  });

  describe('Booking Model', () => {
    test('should be defined', () => {
      expect(Booking).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Booking.tableName).toBe('bookings');
    });

    test('should have required fields', () => {
      const attributes = Booking.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.passengerId).toBeDefined();
      expect(attributes.busId).toBeDefined();
      expect(attributes.seatNumber).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
    });

    test('should have paranoid mode disabled', () => {
      expect(Booking.options.paranoid).toBe(false);
    });

    test('should have status ENUM with correct values', () => {
      const attributes = Booking.rawAttributes;
      expect(attributes.status.type.values).toEqual(['pending', 'confirmed', 'cancelled']);
    });

    test('should have default status as pending', () => {
      const attributes = Booking.rawAttributes;
      expect(attributes.status.defaultValue).toBe('pending');
    });

    test('should have foreign key references', () => {
      const attributes = Booking.rawAttributes;
      expect(attributes.passengerId.references).toBeDefined();
      expect(attributes.passengerId.references.model).toBe('users');
      expect(attributes.busId.references).toBeDefined();
      expect(attributes.busId.references.model).toBe('buses');
    });
  });

  describe('Payment Model', () => {
    test('should be defined', () => {
      expect(Payment).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Payment.tableName).toBe('payments');
    });

    test('should have required fields', () => {
      const attributes = Payment.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.bookingId).toBeDefined();
      expect(attributes.amount).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.qrCodeToken).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
    });

    test('should have paranoid mode disabled', () => {
      expect(Payment.options.paranoid).toBe(false);
    });

    test('should have status ENUM with correct values', () => {
      const attributes = Payment.rawAttributes;
      expect(attributes.status.type.values).toEqual(['pending', 'completed', 'failed', 'refund_pending']);
    });

    test('should have default status as pending', () => {
      const attributes = Payment.rawAttributes;
      expect(attributes.status.defaultValue).toBe('pending');
    });

    test('should have foreign key reference to bookings', () => {
      const attributes = Payment.rawAttributes;
      expect(attributes.bookingId.references).toBeDefined();
      expect(attributes.bookingId.references.model).toBe('bookings');
    });

    test('should have amount as DECIMAL type', () => {
      const attributes = Payment.rawAttributes;
      expect(attributes.amount.type.key).toBe('DECIMAL');
    });
  });

  describe('Notification Model', () => {
    test('should be defined', () => {
      expect(Notification).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(Notification.tableName).toBe('notifications');
    });

    test('should have required fields', () => {
      const attributes = Notification.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.userId).toBeDefined();
      expect(attributes.messageType).toBeDefined();
      expect(attributes.message).toBeDefined();
      expect(attributes.isRead).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
    });

    test('should have paranoid mode disabled', () => {
      expect(Notification.options.paranoid).toBe(false);
    });

    test('should have messageType ENUM with correct values', () => {
      const attributes = Notification.rawAttributes;
      expect(attributes.messageType.type.values).toEqual(['booking_created', 'payment_confirmed', 'payment_failed', 'booking_cancelled']);
    });

    test('should have default isRead as false', () => {
      const attributes = Notification.rawAttributes;
      expect(attributes.isRead.defaultValue).toBe(false);
    });

    test('should have foreign key reference to users', () => {
      const attributes = Notification.rawAttributes;
      expect(attributes.userId.references).toBeDefined();
      expect(attributes.userId.references.model).toBe('users');
    });
  });

  describe('TravelHistory Model', () => {
    test('should be defined', () => {
      expect(TravelHistory).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(TravelHistory.tableName).toBe('travel_history');
    });

    test('should have required fields', () => {
      const attributes = TravelHistory.rawAttributes;
      expect(attributes.id).toBeDefined();
      expect(attributes.bookingId).toBeDefined();
      expect(attributes.busId).toBeDefined();
      expect(attributes.completedAt).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
    });

    test('should have paranoid mode disabled', () => {
      expect(TravelHistory.options.paranoid).toBe(false);
    });

    test('should not have updatedAt field', () => {
      const attributes = TravelHistory.rawAttributes;
      expect(attributes.updatedAt).toBeUndefined();
    });

    test('should have foreign key references', () => {
      const attributes = TravelHistory.rawAttributes;
      expect(attributes.bookingId.references).toBeDefined();
      expect(attributes.bookingId.references.model).toBe('bookings');
      expect(attributes.busId.references).toBeDefined();
      expect(attributes.busId.references.model).toBe('buses');
    });
  });
});
