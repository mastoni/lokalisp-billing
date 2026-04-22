const { RouterOSAPI } = require('node-routeros');

async function run() {
  const args = process.argv.slice(2);
  if (args.length < 5) {
    console.error(JSON.stringify({ success: false, message: 'Missing arguments' }));
    process.exit(1);
  }

  const [host, user, password, port, command, ...paramsJson] = args;
  const config = {
    host,
    user,
    password,
    port: parseInt(port),
    timeout: 5
  };

  const client = new RouterOSAPI(config);

  try {
    await client.connect();
    
    let params = {};
    if (paramsJson.length > 0) {
      try {
        params = JSON.parse(paramsJson.join(' '));
      } catch (e) {
        // ignore parse error if any
      }
    }

    const data = await client.write(command, params);
    console.log(JSON.stringify({ success: true, data }));
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ 
      success: false, 
      message: error.message,
      errno: error.errno 
    }));
    try { await client.close(); } catch(e) {}
    process.exit(1);
  }
}

// Global error handler to catch !empty and other unhandled stuff inside the worker
process.on('uncaughtException', (err) => {
  console.error(JSON.stringify({ success: false, message: 'Protocol Error: ' + err.message, fatal: true }));
  process.exit(1);
});

run();
