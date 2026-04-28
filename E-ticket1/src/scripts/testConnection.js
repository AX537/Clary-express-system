import { testConnection, closeConnection, dbConfig } from '../../config/database.js';

/**
 * Database Connection Test Script
 * 
 * This script tests the database connection configuration
 * and verifies that the application can connect to MySQL.
 */

const runConnectionTest = async () => {
  console.log('=================================');
  console.log('Database Connection Test');
  console.log('=================================\n');

  console.log('Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  Username: ${dbConfig.username}`);
  console.log(`  Dialect: ${dbConfig.dialect}\n`);

  console.log('Testing connection...\n');

  const isConnected = await testConnection();

  if (isConnected) {
    console.log('\n✓ Connection test passed!');
    console.log('The application can successfully connect to the database.\n');
    
    // Close the connection
    await closeConnection();
    process.exit(0);
  } else {
    console.log('\n✗ Connection test failed!');
    console.log('Please check your database configuration in the .env file.\n');
    console.log('Common issues:');
    console.log('  - MySQL server is not running');
    console.log('  - Incorrect database credentials');
    console.log('  - Database does not exist');
    console.log('  - Firewall blocking the connection\n');
    
    process.exit(1);
  }
};

// Run the test
runConnectionTest().catch((error) => {
  console.error('Unexpected error during connection test:', error);
  process.exit(1);
});
