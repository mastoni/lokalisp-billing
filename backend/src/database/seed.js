const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lokalisp_billing',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function seedSampleData() {
  console.log('\n🌱 Seeding sample data...\n');
  
  try {
    // Sample customers
    const customers = [
      { name: 'Ahmad Rizki', email: 'ahmad@email.com', phone: '081234567890', address: 'Jl. Merdeka No. 123, Jakarta', package_name: 'Premium 50Mbps', status: 'active' },
      { name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567891', address: 'Jl. Sudirman No. 45, Bandung', package_name: 'Ultimate 100Mbps', status: 'active' },
      { name: 'Siti Nurhaliza', email: 'siti@email.com', phone: '081234567892', address: 'Jl. Gatot Subroto No. 78, Surabaya', package_name: 'Standard 20Mbps', status: 'active' },
      { name: 'Dewi Lestari', email: 'dewi@email.com', phone: '081234567893', address: 'Jl. Ahmad Yani No. 234, Semarang', package_name: 'Basic 10Mbps', status: 'active' },
      { name: 'Eko Prasetyo', email: 'eko@email.com', phone: '081234567894', address: 'Jl. Pahlawan No. 56, Yogyakarta', package_name: 'Premium 50Mbps', status: 'active' },
    ];
    
    console.log('Inserting sample customers...');
    
    for (const customer of customers) {
      // Get package
      const packageResult = await pool.query(
        'SELECT id FROM packages WHERE package_name = $1',
        [customer.package_name]
      );
      
      if (packageResult.rows.length > 0) {
        const packageId = packageResult.rows[0].id;
        
        // Insert customer
        await pool.query(
          `INSERT INTO customers (name, email, phone, address, package_id, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [customer.name, customer.email, customer.phone, customer.address, packageId, customer.status]
        );
        
        console.log(`  ✓ ${customer.name}`);
      }
    }
    
    console.log('\n✅ Sample data seeded successfully!\n');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await pool.end();
  }
}

seedSampleData();
