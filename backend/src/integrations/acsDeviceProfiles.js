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

function getText(device, path) {
  const v = extractValue(getPath(device, path));
  if (v == null) return '';
  return String(v);
}

function hasParam(device, path) {
  return extractValue(getPath(device, path)) != null;
}

const TR181_SSID = [
  'Device.WiFi.SSID.1.SSID',
  'Device.WiFi.SSID.2.SSID',
  'Device.WiFi.SSID.3.SSID',
  'Device.WiFi.SSID.4.SSID',
];

const TR181_PASS = [
  'Device.WiFi.AccessPoint.1.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.2.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.3.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.4.Security.KeyPassphrase',
  'Device.WiFi.AccessPoint.1.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.2.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.3.Security.PreSharedKey',
  'Device.WiFi.AccessPoint.4.Security.PreSharedKey',
];

const TR098_SSID = [
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.SSID',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.SSID',
];

const TR098_PASS = [
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.KeyPassphrase',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.PreSharedKey.1.PreSharedKey',
  'InternetGatewayDevice.LANDevice.1.WLANConfiguration.4.PreSharedKey.1.PreSharedKey',
];

function vendorIncludes(device, text) {
  const manufacturer = getText(device, 'DeviceID.Manufacturer') || getText(device, 'InternetGatewayDevice.DeviceInfo.Manufacturer');
  return manufacturer.toLowerCase().includes(text.toLowerCase());
}

function modelIncludes(device, text) {
  const model = getText(device, 'InternetGatewayDevice.DeviceInfo.ModelName') || getText(device, 'Device.DeviceInfo.ModelName');
  return model.toLowerCase().includes(text.toLowerCase());
}

const PROFILES = [
  {
    name: 'tr181-generic',
    match: (d) =>
      hasParam(d, 'Device.WiFi.SSID.1.SSID') || hasParam(d, 'Device.WiFi.AccessPoint.1.Security.KeyPassphrase'),
    ssidPaths: TR181_SSID,
    passPaths: TR181_PASS,
  },
  {
    name: 'huawei-tr098',
    match: (d) => vendorIncludes(d, 'huawei') && hasParam(d, 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID'),
    ssidPaths: TR098_SSID,
    passPaths: TR098_PASS,
  },
  {
    name: 'zte-tr098',
    match: (d) => vendorIncludes(d, 'zte') && hasParam(d, 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID'),
    ssidPaths: TR098_SSID,
    passPaths: TR098_PASS,
  },
  {
    name: 'fiberhome-tr098',
    match: (d) => vendorIncludes(d, 'fiberhome') && hasParam(d, 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID'),
    ssidPaths: TR098_SSID,
    passPaths: TR098_PASS,
  },
  {
    name: 'tr098-generic',
    match: (d) => hasParam(d, 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID'),
    ssidPaths: TR098_SSID,
    passPaths: TR098_PASS,
  },
  {
    name: 'fallback',
    match: () => true,
    ssidPaths: [...TR098_SSID, ...TR181_SSID],
    passPaths: [...TR098_PASS, ...TR181_PASS],
  },
];

function getDeviceProfile(device) {
  if (!device) return PROFILES[PROFILES.length - 1];
  for (const p of PROFILES) {
    try {
      if (p.match(device)) return p;
    } catch {
    }
  }
  return PROFILES[PROFILES.length - 1];
}

module.exports = { getDeviceProfile, PROFILES };

