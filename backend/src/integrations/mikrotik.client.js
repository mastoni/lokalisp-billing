const { spawn } = require('child_process');
const path = require('path');

/**
 * MikroTik API Client using worker process
 */
class MikroTikClient {
  constructor(config) {
    this.config = {
      host: config.host || config.mikrotik_host,
      user: config.user || config.mikrotik_user,
      password: config.password || config.mikrotik_password,
      port: config.port || config.mikrotik_port || 8728,
    };
  }

  async exec(command, params = null) {
    return new Promise((resolve, reject) => {
      const workerPath = path.join(__dirname, 'mikrotik.worker.js');
      const args = [
        this.config.host,
        this.config.user,
        this.config.password,
        this.config.port.toString(),
        command
      ];

      if (params) {
        args.push(JSON.stringify(params));
      }

      const child = spawn('node', [workerPath, ...args]);

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          try {
            const err = JSON.parse(stderr);
            return reject(new Error(err.message || 'Worker failed'));
          } catch (e) {
            return reject(new Error(stderr || `Worker exited with code ${code}`));
          }
        }

        try {
          const result = JSON.parse(stdout);
          if (result.success) {
            resolve(result.data);
          } else {
            reject(new Error(result.message || 'Operation failed'));
          }
        } catch (e) {
          reject(new Error('Failed to parse worker output'));
        }
      });
    });
  }

  // --- PPPoE Secret Management ---

  async getSecrets() {
    return this.exec('/ppp/secret/print');
  }

  async addSecret({ name, password, service = 'pppoe', profile = 'default', comment = '' }) {
    return this.exec('/ppp/secret/add', {
      name,
      password,
      service,
      profile,
      comment
    });
  }

  async updateSecret(name, data) {
    const existing = await this.exec('/ppp/secret/print', {
      '?.name': name
    });

    if (!existing || existing.length === 0) {
      throw new Error(`Secret ${name} not found`);
    }

    return this.exec('/ppp/secret/set', {
      '.id': existing[0]['.id'],
      ...data
    });
  }

  async removeSecret(name) {
    const existing = await this.exec('/ppp/secret/print', {
      '?.name': name
    });

    if (existing && existing.length > 0) {
      return this.exec('/ppp/secret/remove', {
        '.id': existing[0]['.id']
      });
    }
  }

  // --- Active Session Management ---

  async getActiveSessions() {
    return this.exec('/ppp/active/print');
  }

  async kickSession(name) {
    const active = await this.exec('/ppp/active/print', {
      '?.name': name
    });

    if (active && active.length > 0) {
      for (const sess of active) {
        await this.exec('/ppp/active/remove', {
          '.id': sess['.id']
        });
      }
      return true;
    }
    return false;
  }

  // --- Queue / Bandwidth Management ---

  async getQueues() {
    return this.exec('/queue/simple/print');
  }

  async upsertQueue({ name, target, maxLimit, comment = '' }) {
    // maxLimit format: "10M/10M" (upload/download)
    const existing = await this.exec('/queue/simple/print', {
       '?.name': name
    });

    if (existing && existing.length > 0) {
      return this.exec('/queue/simple/set', {
        '.id': existing[0]['.id'],
        target,
        'max-limit': maxLimit,
        comment
      });
    } else {
      return this.exec('/queue/simple/add', {
        name,
        target,
        'max-limit': maxLimit,
        comment
      });
    }
  }

  // --- Hotspot Management ---
  async getHotspotUsers() {
    return this.exec('/ip/hotspot/user/print');
  }

  async getActiveHotspot() {
    return this.exec('/ip/hotspot/active/print');
  }

  // --- Profiles ---
  async getPPPProfiles() {
    return this.exec('/ppp/profile/print');
  }

  async getHotspotProfiles() {
    return this.exec('/ip/hotspot/user/profile/print');
  }

  // --- Monitoring ---
  async getResource() {
    const res = await this.exec('/system/resource/print');
    return res[0];
  }
}

/**
 * Singleton-like wrapper for testing connectivity
 */
async function testMikroTik(config) {
  const client = new MikroTikClient(config);
  try {
    const resource = await client.getResource();
    
    if (!resource) {
      throw new Error('Could not retrieve system resource info');
    }

    return { 
      success: true, 
      message: 'MikroTik Connected Successfully', 
      details: {
        model: resource.board_name,
        version: resource.version,
        uptime: resource.uptime,
        cpu_load: `${resource['cpu-load']}%`
      }
    };
  } catch (err) {
    return { 
      success: false, 
      message: `MikroTik Test Connection Failed: ${err.message || 'Unknown error'}`,
      details: err
    };
  }
}

module.exports = { MikroTikClient, testMikroTik };
