const pool = require('../src/config/database.js');

async function check() {
  const res = await pool.query("SELECT * FROM system_settings WHERE category = 'mikrotik'");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}

check();
