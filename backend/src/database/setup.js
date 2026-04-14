const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to default 'postgres' database to create new database
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default postgres database
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'lokalisp_billing';
  
  console.log('\n🚀 Setting up database...\n');
  console.log(`Database: ${dbName}`);
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Port: ${process.env.DB_PORT || 5432}`);
  console.log(`User: ${process.env.DB_USER || 'postgres'}\n`);
  
  try {
    // Check if database exists
    const checkResult = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`✓ Database '${dbName}' already exists\n`);
    } else {
      console.log(`Creating database '${dbName}'...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✓ Database '${dbName}' created successfully\n`);
    }
    
    await pool.end();
    
    // Now run migrations
    console.log('═══════════════════════════════════════');
    console.log('✅ Database setup complete!');
    console.log('═══════════════════════════════════════\n');
    
    console.log('Now running migrations...\n');
    
    // Spawn migration process
    const { spawn } = require('child_process');
    const migrate = spawn('npm', ['run', 'migrate'], {
      stdio: 'inherit',
      shell: true
    });
    
    migrate.on('error', (err) => {
      console.error('Failed to start migration:', err);
      process.exit(1);
    });
    
    migrate.on('close', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createDatabase();
