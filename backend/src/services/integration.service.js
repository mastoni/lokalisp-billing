const SettingService = require('./setting.service');
const CustomerService = require('./customer.service');
const DeviceService = require('./device.service');
const { testGenieAcs, getDevices } = require('../integrations/genieacs.client');
const { testMikroTik } = require('../integrations/mikrotik.client');
const { testRadius } = require('../integrations/radius.client');

const IntegrationService = {
  async test(provider) {
    const p = String(provider || '').toLowerCase();

    if (p === 'genieacs') {
      const cfg = await SettingService.getCategoryMap('genieacs');
      return testGenieAcs(cfg);
    }

    if (p === 'mikrotik') {
      const cfg = await SettingService.getCategoryMap('mikrotik');
      return testMikroTik(cfg);
    }

    if (p === 'radius') {
      const cfg = await SettingService.getCategoryMap('radius');
      return testRadius(cfg);
    }

    return { success: false, message: 'Unknown provider' };
  },

  async syncAcsDevices() {
    const cfg = await SettingService.getCategoryMap('genieacs');
    const projection = '_id,_lastInform';

    let updatedCustomers = 0;
    let updatedNetworkDevices = 0;
    let totalAcsDevices = 0;
    let skip = 0;
    const limit = 200;

    while (true) {
      const devices = await getDevices(cfg, { projection, limit: String(limit), skip: String(skip) });
      if (!Array.isArray(devices)) {
        throw new Error('Invalid response from GenieACS');
      }

      totalAcsDevices += devices.length;

      for (const d of devices) {
        if (d._id && d._lastInform) {
          const lastSeen = new Date(d._lastInform);

          const cUpdated = await CustomerService.touchLastSeenByAcsDeviceId(d._id, lastSeen);
          updatedCustomers += cUpdated;

          const dUpdated = await DeviceService.touchLastSeenByAcsDeviceId(d._id, lastSeen);
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
        updated_customers: updatedCustomers,
        updated_network_devices: updatedNetworkDevices,
      },
    };
  },
};

module.exports = IntegrationService;
