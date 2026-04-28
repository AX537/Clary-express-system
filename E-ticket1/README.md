# E-Ticketing System

Backend REST API for an E-Ticketing System with bus booking, QR code payments, and role-based access control.

## Technology Stack

- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.18.x
- **Database**: MySQL 8.0.x
- **ORM**: Sequelize 6.37.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Module System**: ES6 modules

## Project Structure

```
e-ticketing-system/
├── config/          # Configuration files (database, environment)
├── migrations/      # Sequelize database migrations
├── seeders/         # Database seed files
├── src/             # Application source code
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware (auth, validation, error handling)
│   ├── models/      # Sequelize models
│   ├── routes/      # Express routes
│   ├── services/    # Business logic layer
│   ├── utils/       # Utility functions
│   └── app.js       # Main application entry point
└── tests/           # Test files (Jest + Supertest)
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database:
```bash
# Create the database
mysql -u root -p
CREATE DATABASE e_ticketing_db;
exit;
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
```

4. Test database connection:
```bash
npm run test:db
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database with initial data
- `npm run test:db` - Test database connection

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=e_ticketing_db
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=24h
```

**Important**: Never commit the `.env` file to version control. Use `.env.example` as a template.

## Features

- User registration and authentication with JWT
- Role-based access control (Admin, Passenger, Driver, Supervisor)
- Bus company management
- Route and schedule management
- Bus search and seat selection
- Booking management
- QR code-based payment processing
- Notification system
- Travel history tracking
- Comprehensive API documentation with Swagger

## License

ISC
