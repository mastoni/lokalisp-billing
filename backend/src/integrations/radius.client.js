const dgram = require('dgram');
const crypto = require('crypto');
const db = require('../config/database');

/**
 * RADIUS Client Utility
 * This handles interaction with the RADIUS database (SQL) and direct UDP testing
 */
class RadiusClient {
  constructor(config = {}) {
    this.config = config;
  }

  // --- SQL Base Methods (Using the main DB connection) ---

  async syncUser({ username, password, cleartext = true }) {
    // Delete existing check attribute for this user
    await db.query('DELETE FROM radcheck WHERE username = $1 AND attribute = $2', [
      username, 
      cleartext ? 'Cleartext-Password' : 'User-Password'
    ]);

    // Insert new password
    await db.query(
      'INSERT INTO radcheck (username, attribute, op, value) VALUES ($1, $2, $3, $4)',
      [username, cleartext ? 'Cleartext-Password' : 'User-Password', ':=', password]
    );
  }

  async setUserGroup(username, groupname) {
    // Delete existing group assignment
    await db.query('DELETE FROM radusergroup WHERE username = $1', [username]);

    // Add to new group
    await db.query(
      'INSERT INTO radusergroup (username, groupname, priority) VALUES ($1, $2, $3)',
      [username, groupname, 1]
    );
  }

  async setReplyAttribute(username, attribute, value, op = ':=') {
    await db.query('DELETE FROM radreply WHERE username = $1 AND attribute = $2', [username, attribute]);
    await db.query(
      'INSERT INTO radreply (username, attribute, op, value) VALUES ($1, $2, $3, $4)',
      [username, attribute, op, value]
    );
  }

  async removeUser(username) {
    await db.query('DELETE FROM radcheck WHERE username = $1', [username]);
    await db.query('DELETE FROM radreply WHERE username = $1', [username]);
    await db.query('DELETE FROM radusergroup WHERE username = $1', [username]);
  }

  // --- Direct UDP Test Methods ---

  async testConnection() {
    return testRadius(this.config);
  }
}

/**
 * Direct RADIUS UDP test (Heartbeat)
 */
async function testRadius({ radius_host, radius_port, radius_secret, radius_nas_identifier }) {
  if (!radius_host) return { success: false, message: 'radius_host is not configured' };

  const port = Number(radius_port || 1812);
  const client = dgram.createSocket('udp4');
  const identifier = crypto.randomBytes(1).readUInt8(0);
  const authenticator = crypto.randomBytes(16);
  
  const packet = buildRadiusPacket({
    code: 12, // Status-Server
    identifier,
    authenticator,
    attributes: [attrString(32, radius_nas_identifier || 'lokalisp-billing')],
  });

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      client.close();
      resolve({ success: false, message: 'RADIUS Timeout' });
    }, 2000);

    client.once('message', () => {
      clearTimeout(timer);
      client.close();
      resolve({ success: true, message: 'RADIUS Reachable' });
    });

    client.send(packet, port, radius_host, (err) => {
      if (err) {
        clearTimeout(timer);
        client.close();
        resolve({ success: false, message: 'RADIUS Send Error', details: err.message });
      }
    });
  });
}

// Helpers for RADIUS binary protocol
function buildRadiusPacket({ code, identifier, authenticator, attributes }) {
  const attrsLen = (attributes || []).reduce((sum, a) => sum + a.length, 0);
  const buf = Buffer.alloc(20 + attrsLen);
  buf.writeUInt8(code, 0);
  buf.writeUInt8(identifier, 1);
  buf.writeUInt16BE(20 + attrsLen, 2);
  authenticator.copy(buf, 4);
  let offset = 20;
  for (const a of attributes) {
    a.copy(buf, offset);
    offset += a.length;
  }
  return buf;
}

function attrString(type, value) {
  const v = Buffer.from(String(value), 'utf8');
  const buf = Buffer.alloc(2 + v.length);
  buf.writeUInt8(type, 0);
  buf.writeUInt8(2 + v.length, 1);
  v.copy(buf, 2);
  return buf;
}

module.exports = { RadiusClient, testRadius };
