const SettingService = require('./setting.service');
const { 
  testGenieAcs, 
  getDevices, 
  reboot, 
  setWifiPasswordAuto 
} = require('../integrations/genieacs.client');
const { testMikroTik, MikroTikClient } = require('../integrations/mikrotik.client');
const { testRadius, RadiusClient } = require('../integrations/radius.client');

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

  // --- MikroTik API WRAPPERS ---
  async syncMikrotikSecret(data) {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.addSecret(data);
  },

  async updateMikrotikSecret(name, data) {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.updateSecret(name, data);
  },

  async kickMikrotikSession(name) {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.kickSession(name);
  },

  async upsertMikrotikQueue(data) {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.upsertQueue(data);
  },

  async getMikrotikResource() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.getResource();
  },

  async getMikrotikPppoe() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.getSecrets();
  },

  async getMikrotikActive() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.getActiveSessions();
  },

  async getMikrotikHotspot() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.getHotspotUsers();
  },

  async getMikrotikActiveHotspot() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    return await client.getActiveHotspot();
  },

  async getMikrotikProfiles() {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    const client = new MikroTikClient(cfg);
    const [ppp, hotspot] = await Promise.all([
      client.getPPPProfiles(),
      client.getHotspotProfiles()
    ]);
    return { ppp, hotspot };
  },

  // --- RADIUS API WRAPPERS ---
  async syncRadiusUser(data) {
    const cfg = await SettingService.getCategoryMap('radius');
    const client = new RadiusClient(cfg);
    return await client.syncUser(data);
  },

  async setRadiusUserGroup(username, groupname) {
    const cfg = await SettingService.getCategoryMap('radius');
    const client = new RadiusClient(cfg);
    return await client.setUserGroup(username, groupname);
  },

  async setRadiusReply(username, attribute, value) {
    const cfg = await SettingService.getCategoryMap('radius');
    const client = new RadiusClient(cfg);
    return await client.setReplyAttribute(username, attribute, value);
  },

  async removeRadiusUser(username) {
    const cfg = await SettingService.getCategoryMap('radius');
    const client = new RadiusClient(cfg);
    return await client.removeUser(username);
  }
};

module.exports = IntegrationService;
