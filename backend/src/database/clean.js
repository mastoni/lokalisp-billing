const db = require('../config/database');

(async () => {
  try {
    console.log('\n🧹 Cleaning up duplicate packages...\n');
    
    const result = await db.query(`
      DELETE FROM packages 
      WHERE id IN (
        SELECT id FROM (
          SELECT id, 
                 ROW_NUMBER() OVER (PARTITION BY package_name ORDER BY created_at) as rn
          FROM packages
        ) t
        WHERE rn > 1
      )
    `);
    
    console.log(`✓ Cleaned ${result.rowCount} duplicate package(s)\n`);
    
    // Show remaining packages
    const packages = await db.query(`
      SELECT package_name, price, speed 
      FROM packages 
      ORDER BY price
    `);
    
    console.log('📦 Current Packages:\n');
    packages.rows.forEach(pkg => {
      console.log(`  ✓ ${pkg.package_name} - Rp ${parseInt(pkg.price).toLocaleString()} (${pkg.speed})`);
    });
    console.log('');
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
