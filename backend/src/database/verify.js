const db = require('../config/database');

(async () => {
  try {
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tables in lokalisp_billing database:\n');
    result.rows.forEach((row, i) => {
      console.log(`  ${i+1}. ${row.table_name}`);
    });
    console.log(`\nTotal: ${result.rows.length} tables\n`);
    
    // Check packages
    const packages = await db.query('SELECT package_name, price, speed FROM packages ORDER BY price');
    console.log('📦 Available Packages:\n');
    packages.rows.forEach(pkg => {
      console.log(`  ✓ ${pkg.package_name} - Rp ${parseInt(pkg.price).toLocaleString()} (${pkg.speed})`);
    });
    console.log('');
    
    // Check customers
    const customers = await db.query('SELECT COUNT(*) as count FROM customers');
    console.log(`👥 Total Customers: ${customers.rows[0].count}\n`);
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
