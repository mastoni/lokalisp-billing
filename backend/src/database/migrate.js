const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lokalisp_billing',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  try {
    await pool.query(sql);
    console.log(`✓ ${fileName} executed successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Error executing ${fileName}:`);
    console.error(error.message);
    return false;
  }
}

async function runAllMigrations() {
  console.log('\n🚀 Starting database migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found');
    process.exit(1);
  }
  
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('No migration files found');
    process.exit(0);
  }
  
  console.log(`Found ${migrationFiles.length} migration file(s):\n`);
  migrationFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const success = await runMigration(filePath);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
      console.error(`\n❌ Migration failed: ${file}\n`);
      console.log('Stopping migrations to prevent data corruption');
      process.exit(1);
    }
  }
  
  console.log('═══════════════════════════════════════');
  console.log(`✅ Migrations completed successfully!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log('═══════════════════════════════════════\n');
  
  await pool.end();
  process.exit(0);
}

// Run migrations
runAllMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
