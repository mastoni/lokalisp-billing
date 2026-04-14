const axios = require('axios');
const { getDeviceProfile } = require('./acsDeviceProfiles');

function createAcsClient({ acs_url, acs_user, acs_password }) {
  if (!acs_url) return null;

  const config = {
    baseURL: acs_url,
    timeout: 10000,
  };

  if (acs_user && acs_password) {
    config.auth = {
      username: acs_user,
      password: acs_password,
    };
  }

  return axios.create(config);
}

async function testGenieAcs(config) {
  const client = createAcsClient(config);
  if (!client) {
    return { success: false, message: 'acs_url is not configured' };
  }

  try {
    // Basic test: fetch 1 device
    await client.get('/devices?limit=1');
    return { success: true, message: 'GenieACS reachable' };
  } catch (error) {
    return {
      success: false,
      message: `GenieACS request failed (${error.response?.status || error.message})`,
      details: error.response?.data || error.message,
    };
  }
}

async function getDevices(config, query = {}) {
  const client = createAcsClient(config);
  if (!client) throw new Error('GenieACS not configured');

  try {
    const params = new URLSearchParams();
    if (query.query) params.append('query', query.query);
    if (query.projection) params.append('projection', query.projection);
    if (query.limit) params.append('limit', query.limit);
    if (query.skip) params.append('skip', query.skip);

    const res = await client.get(`/devices?${params.toString()}`);
    return res.data; // array of devices
  } catch (error) {
    throw new Error(`Failed to get devices: ${error.message}`);
  }
}

function getPath(obj, path) {
  if (!obj) return null;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return cur;
}

function extractValue(node) {
  if (node == null) return null;
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return node;
  if (Array.isArray(node)) return extractValue(node[0]);
  if (typeof node === 'object') {
    if (node._value !== undefined) return node._value;
    if (node.value !== undefined) return node.value;
  }
  return null;
}

function hasParam(device, path) {
  return extractValue(getPath(device, path)) != null;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

const WIFI_SSID_CANDIDATES = [
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.SSID',
  'Device.WiFi.SSID.1.SSID',
  'Device.WiFi.SSID.2.SSID',
  'Device.WiFi.SSID.3.SSID',
  'Device.WiFi.SSID.4.SSID',
];

const WIFI_PASS_CANDIDATES = [
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.KeyPassphrase',
  'Device.WiFi.AccessPoint.1.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.2.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.3.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.4.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.1.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.2.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.3.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.4.Security.PreSharedKey',
];

async function getDeviceById(config, deviceId, projection) {
  const query = JSON.stringify({ _id: deviceId });
  const devices = await getDevices(config, {
    query,
    projection,
    limit: '1',
  });
  if (!Array.isArray(devices)) return null;
  return devices[0] || null;
}

function detectWifiParameterPaths(device) {
  const ssid = WIFI_SSID_CANDIDATES.filter((p) => hasParam(device, p));
  const pass = WIFI_PASS_CANDIDATES.filter((p) => hasParam(device, p));
  return {
    ssidPaths: unique(ssid),
    passPaths: unique(pass),
  };
}

async function createTask(config, deviceId, task, options = {}) {
  const client = createAcsClient(config);
  if (!client) throw new Error('GenieACS not configured');
  if (!deviceId) throw new Error('deviceId is required');
  if (!task || typeof task !== 'object') throw new Error('task is required');

  const qs = options.connection_request ? '?connection_request' : '';
  const res = await client.post(`/devices/${encodeURIComponent(deviceId)}/tasks${qs}`, task, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}

async function setWifiPassword(config, deviceId, { password, ssid } = {}, options = {}) {
  if (!password) throw new Error('password is required');
  const parameterValues = [];

  const ssidPaths = [
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID',
  ];

  const passPaths = [
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey',
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.PreSharedKey',
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase',
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.KeyPassphrase',
  ];

  for (const p of passPaths) parameterValues.push([p, password, 'xsd:string']);
  if (ssid) for (const p of ssidPaths) parameterValues.push([p, ssid, 'xsd:string']);

  const task = { name: 'setParameterValues', parameterValues };
  return createTask(config, deviceId, task, options);
}

async function setWifiPasswordAuto(config, deviceId, { password, ssid } = {}, options = {}) {
  if (!password) throw new Error('password is required');

  const projection = unique([
    '_id',
    '_lastInform',
    'DeviceID.SerialNumber',
    'DeviceID.Manufacturer',
    'DeviceID.ProductClass',
    'InternetGatewayDevice.DeviceInfo.ModelName',
    'InternetGatewayDevice.DeviceInfo.Manufacturer',
    ...WIFI_SSID_CANDIDATES,
    ...WIFI_PASS_CANDIDATES,
  ]).join(',');

  const device = await getDeviceById(config, deviceId, projection);

  let ssidPaths = [];
  let passPaths = [];

  if (device) {
    const profile = getDeviceProfile(device);
    const preferredSsid = (profile.ssidPaths || []).filter((p) => hasParam(device, p));
    const preferredPass = (profile.passPaths || []).filter((p) => hasParam(device, p));

    const detected = detectWifiParameterPaths(device);
    ssidPaths = unique([...preferredSsid, ...detected.ssidPaths]);
    passPaths = unique([...preferredPass, ...detected.passPaths]);
  }

  if (passPaths.length === 0) passPaths = WIFI_PASS_CANDIDATES;
  if (ssidPaths.length === 0) ssidPaths = WIFI_SSID_CANDIDATES.slice(0, 2);

  const parameterValues = [];
  for (const p of passPaths) parameterValues.push([p, password, 'xsd:string']);
  if (ssid) for (const p of ssidPaths) parameterValues.push([p, ssid, 'xsd:string']);

  const task = { name: 'setParameterValues', parameterValues };
  return createTask(config, deviceId, task, options);
}

async function reboot(config, deviceId, options = {}) {
  const task = { name: 'reboot' };
  return createTask(config, deviceId, task, options);
}

async function refreshDevice(config, deviceId, options = {}) {
  const task = { name: 'refreshObject', objectName: '' }; // Refresh root
  return createTask(config, deviceId, task, options);
}

module.exports = {
  testGenieAcs,
  getDevices,
  getDeviceById,
  createTask,
  setWifiPassword,
  setWifiPasswordAuto,
  detectWifiParameterPaths,
  reboot,
  refreshDevice,
};
