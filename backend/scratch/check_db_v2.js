const db = require('../src/config/database');

async function check() {
  try {
    const res = await db.query("SELECT * FROM system_settings WHERE category IN ('mikrotik', 'radius')");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
