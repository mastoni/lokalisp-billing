const net = require('net');

async function testMikroTik({ mikrotik_host, mikrotik_port }) {
  if (!mikrotik_host) {
    return { success: false, message: 'mikrotik_host is not configured' };
  }

  const port = Number(mikrotik_port || 8728);
  if (!Number.isFinite(port) || port <= 0) {
    return { success: false, message: 'mikrotik_port is invalid' };
  }

  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeoutMs = 2000;

    const done = (result) => {
      try {
        socket.destroy();
      } catch {
      }
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done({ success: true, message: 'MikroTik API port reachable' }));
    socket.once('timeout', () => done({ success: false, message: 'MikroTik connection timeout' }));
    socket.once('error', (err) => done({ success: false, message: 'MikroTik connection failed', details: err.message }));

    socket.connect(port, mikrotik_host);
  });
}

module.exports = { testMikroTik };
