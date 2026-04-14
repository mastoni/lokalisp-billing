const dgram = require('dgram');
const crypto = require('crypto');

function buildRadiusPacket({ code, identifier, authenticator, attributes }) {
  const attrs = attributes || [];
  const attrsLen = attrs.reduce((sum, a) => sum + a.length, 0);
  const length = 20 + attrsLen;
  const buf = Buffer.alloc(length);
  buf.writeUInt8(code, 0);
  buf.writeUInt8(identifier, 1);
  buf.writeUInt16BE(length, 2);
  authenticator.copy(buf, 4);
  let offset = 20;
  for (const a of attrs) {
    a.copy(buf, offset);
    offset += a.length;
  }
  return buf;
}

function attrString(type, value) {
  const v = Buffer.from(String(value), 'utf8');
  const len = 2 + v.length;
  const buf = Buffer.alloc(len);
  buf.writeUInt8(type, 0);
  buf.writeUInt8(len, 1);
  v.copy(buf, 2);
  return buf;
}

async function testRadius({ radius_host, radius_port, radius_secret, radius_nas_identifier }) {
  if (!radius_host) return { success: false, message: 'radius_host is not configured' };

  const port = Number(radius_port || 1812);
  if (!Number.isFinite(port) || port <= 0) {
    return { success: false, message: 'radius_port is invalid' };
  }

  if (!radius_secret) {
    return { success: false, message: 'radius_secret is not configured' };
  }

  const client = dgram.createSocket('udp4');

  const identifier = crypto.randomBytes(1).readUInt8(0);
  const authenticator = crypto.randomBytes(16);
  const attrs = [
    attrString(32, radius_nas_identifier || 'lokalisp-billing'),
  ];

  const packet = buildRadiusPacket({
    code: 12,
    identifier,
    authenticator,
    attributes: attrs,
  });

  return new Promise((resolve) => {
    const timeoutMs = 2000;
    const timer = setTimeout(() => {
      try {
        client.close();
      } catch {
      }
      resolve({ success: false, message: 'RADIUS no response (timeout)' });
    }, timeoutMs);

    client.once('message', (msg) => {
      clearTimeout(timer);
      try {
        client.close();
      } catch {
      }
      const code = msg.readUInt8(0);
      resolve({ success: true, message: 'RADIUS responded', details: { code } });
    });

    client.send(packet, port, radius_host, (err) => {
      if (err) {
        clearTimeout(timer);
        try {
          client.close();
        } catch {
        }
        resolve({ success: false, message: 'RADIUS send failed', details: err.message });
      }
    });
  });
}

module.exports = { testRadius };
