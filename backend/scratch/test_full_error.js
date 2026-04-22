const { RouterOSAPI } = require('node-routeros');

async function test() {
  const config = {
    host: '192.168.2.1',
    user: 'kangtoni',
    password: 'password', // I don't know the real password, user had 06juli1975 in DB
    port: 2620,
    timeout: 3000
  };

  console.log('Testing with:', config.host, config.port);
  const conn = new RouterOSAPI(config);

  try {
    console.log('Connecting...');
    await conn.connect();
    console.log('Connected!');
    const res = await conn.write('/system/resource/print');
    console.log('Result:', res);
  } catch (err) {
    console.log('Error Type:', typeof err);
    console.log('Error Keys:', Object.keys(err));
    console.log('Error Message:', err.message);
    console.log('Error String:', String(err));
    console.log('Full Error:', err);
  } finally {
    try { await conn.close(); } catch(e) {}
    process.exit(0);
  }
}

test();
