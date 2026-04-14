const db = require('../config/database');
const SettingService = require('./setting.service');
const CustomerService = require('./customer.service');
const IntegrationService = require('./integration.service');

const DeviceService = {
  async getAllDevices() {
    const query = 'SELECT * FROM devices ORDER BY name ASC';
    const result = await db.query(query);
    return result.rows;
  },

  async getDeviceById(id) {
    const query = 'SELECT * FROM devices WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async createDevice(data) {
    const { name, type, ip_address, username, password, location, status, acs_device_id } = data;
    const query = `
      INSERT INTO devices (name, type, ip_address, username, password, location, status, acs_device_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [name, type, ip_address, username, password, location, status || 'active', acs_device_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateDevice(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return this.getDeviceById(id);

    values.push(id);
    const query = `
      UPDATE devices 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deleteDevice(id) {
    const query = 'DELETE FROM devices WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },

  async touchLastSeenByAcsDeviceId(acsDeviceId, at = new Date()) {
    const query = `
      UPDATE devices
      SET last_seen = $2, updated_at = CURRENT_TIMESTAMP
      WHERE acs_device_id = $1
    `;
    const result = await db.query(query, [acsDeviceId, at]);
    return result.rowCount || 0;
  },

  /**
   * Sync devices from GenieACS and update local database
   */
  async syncWithAcs() {
    const projection = '_id,_lastInform,DeviceID.SerialNumber,DeviceID.ProductClass,DeviceID.Manufacturer';

    let updatedCustomers = 0;
    let mappedCustomers = 0;
    let updatedNetworkDevices = 0;
    let totalAcsDevices = 0;
    let skip = 0;
    const limit = 200;

    // Helper to get nested value
    const getVal = (obj, path) => {
      const parts = path.split('.');
      let cur = obj;
      for (const p of parts) if (cur) cur = cur[p];
      return cur && (cur._value !== undefined ? cur._value : (cur.value !== undefined ? cur.value : cur));
    };

    while (true) {
      const devices = await IntegrationService.getAcsDevices({ 
        projection, 
        limit: String(limit), 
        skip: String(skip) 
      });
      
      if (!Array.isArray(devices)) {
        throw new Error('Invalid response from GenieACS');
      }

      if (devices.length === 0) break;
      totalAcsDevices += devices.length;

      for (const d of devices) {
        if (d._id && d._lastInform) {
          const lastSeen = new Date(d._lastInform);
          const serialNumber = getVal(d, 'DeviceID.SerialNumber');

          // 1. Try to map to customer by Serial Number if not yet mapped
          if (serialNumber) {
            const mapped = await CustomerService.updateAcsMappingBySerialNumber(serialNumber, d._id);
            mappedCustomers += mapped;
          }

          // 2. Update customer last seen if associated
          const cUpdated = await CustomerService.touchLastSeenByAcsDeviceId(d._id, lastSeen);
          updatedCustomers += cUpdated;

          // 3. Update/Touch device in DB
          const dUpdated = await this.touchLastSeenByAcsDeviceId(d._id, lastSeen);
          updatedNetworkDevices += dUpdated;
        }
      }

      if (devices.length < limit) break;
      skip += limit;
    }

    return {
      success: true,
      message: 'Sync completed',
      details: {
        total_acs_devices: totalAcsDevices,
        mapped_new_customers: mappedCustomers,
        updated_customers: updatedCustomers,
        updated_network_devices: updatedNetworkDevices,
      },
    };
  },

  async reboot(acsDeviceId) {
    return await IntegrationService.rebootAcs(acsDeviceId);
  },

  async setWifiPassword(acsDeviceId, { password, ssid }) {
    return await IntegrationService.setAcsWifi(acsDeviceId, { password, ssid });
  },

  async getWifiInfo(acsDeviceId) {
    const projection = [
      '_id',
      'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
      'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Status',
      'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Enable',
      'Device.WiFi.SSID.1.SSID',
      'Device.WiFi.SSID.1.Status',
      'Device.WiFi.Service.1.Enabled',
      'Device.WiFi.AccessPoint.1.Status',
    ].join(',');

    const devices = await IntegrationService.getAcsDevices({ 
      query: JSON.stringify({ _id: acsDeviceId }), 
      projection,
      limit: '1'
    });

    if (!devices || devices.length === 0) {
      throw new Error('Device not found in ACS');
    }

    const device = devices[0];
    
    // Simple helper to extract value safely (can be moved to a util)
    const getVal = (path) => {
      const parts = path.split('.');
      let cur = device;
      for (const p of parts) if (cur) cur = cur[p];
      return cur && (cur._value !== undefined ? cur._value : (cur.value !== undefined ? cur.value : cur));
    };

    return {
      ssid: getVal('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID') || getVal('Device.WiFi.SSID.1.SSID'),
      status: getVal('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Status') || getVal('Device.WiFi.SSID.1.Status'),
      enabled: getVal('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Enable') || getVal('Device.WiFi.Service.1.Enabled'),
    };
  },

  async queueCommand(deviceId, commandName, payload = null) {
    const DeviceCommandService = require('./deviceCommand.service');
    return await DeviceCommandService.create({
      device_id: deviceId,
      command_name: commandName,
      payload: payload
    });
  },
};

module.exports = DeviceService;
