const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lokalisp_billing',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

const BCRYPT_ROUNDS = 10;

async function seedUsers() {
  console.log('\n👥 Seeding users...\n');

  const users = [
    {
      username: 'admin',
      email: 'admin@lokalisp.com',
      password: 'admin123',
      fullName: 'System Administrator',
      phone: '+6281234567890',
      role: 'admin',
    },
    {
      username: 'customer1',
      email: 'customer1@example.com',
      password: 'customer123',
      fullName: 'Ahmad Rizki',
      phone: '+6281234567891',
      role: 'customer',
    },
    {
      username: 'teknisi1',
      email: 'teknisi1@lokalisp.com',
      password: 'teknisi123',
      fullName: 'Budi Santoso',
      phone: '+6281234567892',
      role: 'teknisi',
    },
    {
      username: 'agen1',
      email: 'agen1@lokalisp.com',
      password: 'agen123',
      fullName: 'Siti Nurhaliza',
      phone: '+6281234567893',
      role: 'agen',
    },
  ];

  for (const user of users) {
    try {
      // Check if user already exists
      const existing = await pool.query('SELECT id FROM users WHERE username = $1', [user.username]);
      
      if (existing.rows.length > 0) {
        console.log(`⏭  ${user.username} already exists, skipping`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
      const passwordHash = await bcrypt.hash(user.password, salt);

      // Get role ID
      const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [user.role]);
      
      if (roleResult.rows.length === 0) {
        console.error(`❌ Role "${user.role}" not found`);
        continue;
      }

      const roleId = roleResult.rows[0].id;

      // Insert user
      await pool.query(
        `INSERT INTO users (username, email, password_hash, full_name, phone, role_id, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [user.username, user.email, passwordHash, user.fullName, user.phone, roleId]
      );

      console.log(`✅ Created user: ${user.username} (${user.role})`);
    } catch (error) {
      console.error(`❌ Error creating ${user.username}:`, error.message);
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Users seeded successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('   Admin:    admin / admin123');
  console.log('   Customer: customer1 / customer123');
  console.log('   Teknisi:  teknisi1 / teknisi123');
  console.log('   Agen:     agen1 / agen123');
  console.log('═══════════════════════════════════════\n');

  await pool.end();
  process.exit(0);
}

seedUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
