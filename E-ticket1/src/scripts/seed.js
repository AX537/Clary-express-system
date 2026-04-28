import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';
import sequelize from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSeeders() {
  try {
    console.log('Starting database seeding...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established\n');

    // Get all seeder files
    const seedersDir = join(__dirname, '../../seeders');
    const files = await readdir(seedersDir);
    const seederFiles = files
      .filter(file => file.endsWith('.js') && !file.startsWith('.'))
      .sort();

    if (seederFiles.length === 0) {
      console.log('No seeder files found in seeders/ directory');
      process.exit(0);
    }

    console.log(`Found ${seederFiles.length} seeder file(s):\n`);

    // Run each seeder
    for (const file of seederFiles) {
      console.log(`Running seeder: ${file}`);
      const seederPath = join(seedersDir, file);
      // Convert Windows path to file URL for ES6 import
      const seederURL = pathToFileURL(seederPath).href;
      const seeder = await import(seederURL);
      
      if (typeof seeder.up === 'function') {
        await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✓ Completed: ${file}\n`);
      } else {
        console.log(`⚠ Skipped: ${file} (no 'up' function found)\n`);
      }
    }

    console.log('✓ All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
