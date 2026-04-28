import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'e_ticketing_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log
  }
);

// Create migrations tracking table
async function createMigrationsTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS sequelize_meta (
      name VARCHAR(255) NOT NULL PRIMARY KEY
    )
  `);
}

// Get executed migrations
async function getExecutedMigrations() {
  const [results] = await sequelize.query(
    'SELECT name FROM sequelize_meta ORDER BY name'
  );
  return results.map(row => row.name);
}

// Record migration as executed
async function recordMigration(name) {
  await sequelize.query(
    'INSERT INTO sequelize_meta (name) VALUES (?)',
    { replacements: [name] }
  );
}

// Remove migration record
async function removeMigrationRecord(name) {
  await sequelize.query(
    'DELETE FROM sequelize_meta WHERE name = ?',
    { replacements: [name] }
  );
}

// Get all migration files
async function getMigrationFiles() {
  const migrationsDir = join(__dirname, '../../migrations');
  const files = await readdir(migrationsDir);
  return files
    .filter(file => file.endsWith('.js') && !file.startsWith('.'))
    .sort();
}

// Run migrations
async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection established\n');

    // Create migrations table
    await createMigrationsTable();

    // Get executed and pending migrations
    const executedMigrations = await getExecutedMigrations();
    const allMigrations = await getMigrationFiles();
    const pendingMigrations = allMigrations.filter(
      migration => !executedMigrations.includes(migration)
    );

    if (pendingMigrations.length === 0) {
      console.log('✓ No pending migrations\n');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s):\n`);
    pendingMigrations.forEach(migration => console.log(`  - ${migration}`));
    console.log('');

    // Run each pending migration
    for (const migrationFile of pendingMigrations) {
      console.log(`Running: ${migrationFile}`);
      
      const migrationPath = join(__dirname, '../../migrations', migrationFile);
      // Convert Windows path to file URL for ES6 import
      const migrationURL = pathToFileURL(migrationPath).href;
      const migration = await import(migrationURL);

      // Execute migration
      await migration.up(sequelize.getQueryInterface(), Sequelize);
      
      // Record as executed
      await recordMigration(migrationFile);
      
      console.log(`✓ Completed: ${migrationFile}\n`);
    }

    console.log('✓ All migrations completed successfully!\n');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Rollback last migration
async function rollbackMigration() {
  try {
    console.log('🔄 Rolling back last migration...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection established\n');

    // Create migrations table
    await createMigrationsTable();

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();

    if (executedMigrations.length === 0) {
      console.log('✓ No migrations to rollback\n');
      return;
    }

    // Get last executed migration
    const lastMigration = executedMigrations[executedMigrations.length - 1];
    console.log(`Rolling back: ${lastMigration}\n`);

    const migrationPath = join(__dirname, '../../migrations', lastMigration);
    // Convert Windows path to file URL for ES6 import
    const migrationURL = pathToFileURL(migrationPath).href;
    const migration = await import(migrationURL);

    // Execute rollback
    await migration.down(sequelize.getQueryInterface(), Sequelize);
    
    // Remove from tracking
    await removeMigrationRecord(lastMigration);
    
    console.log(`✓ Rolled back: ${lastMigration}\n`);
  } catch (error) {
    console.error('✗ Rollback failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Main execution
const command = process.argv[2];

if (command === 'rollback') {
  rollbackMigration();
} else {
  runMigrations();
}
