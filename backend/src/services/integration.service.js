const SettingService = require('./setting.service');
const { 
  testGenieAcs, 
  getDevices, 
  reboot, 
  setWifiPasswordAuto 
} = require('../integrations/genieacs.client');
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

  // --- ACS API WRAPPERS ---
  async getAcsDevices(query = {}) {
    const cfg = await SettingService.getCategoryMap('genieacs');
    return await getDevices(cfg, query);
  },

  async rebootAcs(acsDeviceId) {
    const cfg = await SettingService.getCategoryMap('genieacs');
    return await reboot(cfg, acsDeviceId, { connection_request: true });
  },

  async setAcsWifi(acsDeviceId, params) {
    const cfg = await SettingService.getCategoryMap('genieacs');
    return await setWifiPasswordAuto(cfg, acsDeviceId, params, { connection_request: true });
  },
};

module.exports = IntegrationService;
