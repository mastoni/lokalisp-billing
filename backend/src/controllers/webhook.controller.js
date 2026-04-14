const SettingService = require('../services/setting.service');
const CustomerService = require('../services/customer.service');
const DeviceService = require('../services/device.service');

function extractDeviceIds(payload) {
  if (!payload || typeof payload !== 'object') return [];

  const candidates = new Set();

  const push = (v) => {
    if (!v) return;
    if (typeof v === 'string' || typeof v === 'number') candidates.add(String(v));
  };

  push(payload.deviceId);
  push(payload.device_id);
  push(payload.device);
  push(payload.id);
  push(payload._id);
  if (payload.device && typeof payload.device === 'object') {
    push(payload.device.id);
    push(payload.device._id);
    push(payload.device.deviceId);
  }
  if (payload.data && typeof payload.data === 'object') {
    push(payload.data.deviceId);
    push(payload.data.device_id);
    push(payload.data.id);
    push(payload.data._id);
  }

  return Array.from(candidates);
}

const genieAcsWebhook = async (req, res) => {
  try {
    const configured = await SettingService.getValue('acs_webhook_secret');
    const expected = configured || process.env.GENIEACS_WEBHOOK_SECRET || '';
    const provided = String(req.headers['x-webhook-secret'] || req.query.secret || '');

    if (!expected || provided !== expected) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const now = new Date();
    const ids = extractDeviceIds(req.body);

    const touched = {
      customers: 0,
      devices: 0,
      ids,
    };

    for (const id of ids) {
      const c = await CustomerService.touchLastSeenByAcsDeviceId(id, now);
      touched.customers += c;

      const d = await DeviceService.touchLastSeenByAcsDeviceId(id, now);
      touched.devices += d;
    }

    return res.json({ success: true, message: 'ok', data: touched });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { genieAcsWebhook };
