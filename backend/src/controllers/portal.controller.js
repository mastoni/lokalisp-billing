const SettingService = require('../services/setting.service');
const CustomerService = require('../services/customer.service');
const DeviceService = require('../services/device.service');
const IntegrationService = require('../services/integration.service');
const InvoiceService = require('../services/invoice.service');
const PaymentService = require('../services/payment.service');
const RewardService = require('../services/reward.service');
const { getDeviceProfile } = require('../integrations/acsDeviceProfiles');

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

function pickFirst(obj, paths) {
  for (const p of paths) {
    const v = extractValue(getPath(obj, p));
    if (v != null && v !== '') return v;
  }
  return null;
}

async function resolveCurrentCustomer(req) {
  return CustomerService.findCustomerForUser({
    email: req.user?.email,
    full_name: req.user?.full_name,
    phone: req.user?.phone,
  });
}

const getMyModem = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found' });
    }

    if (!customer.acs_device_id) {
      return res.json({
        success: true,
        data: {
          customer,
          modem: null,
          message: 'Device not yet mapped to your account. Please wait for sync or contact support.',
        },
      });
    }

    const projection = [
      '_id',
      '_lastInform',
      'DeviceID.SerialNumber',
      'DeviceID.Manufacturer',
      'DeviceID.ProductClass',
      'InternetGatewayDevice.DeviceInfo.ModelName',
      'InternetGatewayDevice.DeviceInfo.UpTime',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress',
      'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
      'InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID',
      'Device.WiFi.SSID.1.SSID',
      'Device.WiFi.SSID.2.SSID',
    ].join(',');

    const devices = await IntegrationService.getAcsDevices({ 
      query: JSON.stringify({ _id: customer.acs_device_id }), 
      projection, 
      limit: '1' 
    });
    const d = Array.isArray(devices) ? devices[0] : null;

    if (!d) {
      return res.json({
        success: true,
        data: {
          customer,
          modem: null,
          message: 'Device offline or not found in ACS',
        },
      });
    }

    const lastInform = d._lastInform ? new Date(d._lastInform) : null;
    const wanIp = pickFirst(d, [
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress',
    ]);

    const modem = {
      acs_device_id: d._id,
      serial_number: pickFirst(d, ['DeviceID.SerialNumber']) || customer.ont_serial_number || null,
      manufacturer: pickFirst(d, ['DeviceID.Manufacturer']),
      product_class: pickFirst(d, ['DeviceID.ProductClass']),
      model: pickFirst(d, ['InternetGatewayDevice.DeviceInfo.ModelName']),
      uptime_seconds: pickFirst(d, ['InternetGatewayDevice.DeviceInfo.UpTime']),
      wan_ip: wanIp,
      ssid_1: pickFirst(d, ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID', 'Device.WiFi.SSID.1.SSID']),
      ssid_2: pickFirst(d, ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID', 'Device.WiFi.SSID.2.SSID']),
      last_inform: lastInform ? lastInform.toISOString() : null,
      wifi_profile: getDeviceProfile(d)?.name,
    };

    return res.json({ success: true, data: { customer, modem } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load modem info',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const rebootModem = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer || !customer.acs_device_id) {
      return res.status(404).json({ success: false, message: 'Modem not found or not mapped' });
    }

    const cmd = await DeviceService.queueCommand(customer.device_id, 'reboot');
    return res.json({ success: true, message: 'Reboot command queued', data: { command: cmd } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to queue reboot',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const changeWifiPassword = async (req, res) => {
  try {
    const { password, ssid } = req.body || {};
    if (!password || String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password minimal 8 karakter' });
    }

    const customer = await resolveCurrentCustomer(req);
    if (!customer || !customer.acs_device_id) {
      return res.status(404).json({ success: false, message: 'Modem not found or not mapped' });
    }

    const cmd = await DeviceService.queueCommand(customer.device_id, 'set_wifi', {
      password: String(password),
      ssid: ssid ? String(ssid) : undefined
    });

    return res.json({ success: true, message: 'WiFi update command queued', data: { command: cmd } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to change WiFi password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found' });
    }

    // Get active invoice
    const invoices = await InvoiceService.getAllInvoices({ customer_id: customer.id, status: 'pending' });
    const activeInvoice = invoices.length > 0 ? invoices[0] : null;

    // Get reward points
    const rewards = await RewardService.getCustomerRewards(customer.id);

    return res.json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          name: customer.name,
          package_name: customer.package_name,
          status: customer.status,
          expiry_date: customer.expiry_date,
        },
        activeInvoice,
        rewardPoints: rewards.points_balance || 0,
        totalPaid: customer.total_paid || 0,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getMyInvoices = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    const invoices = await InvoiceService.getAllInvoices({ customer_id: customer.id });
    return res.json({ success: true, data: invoices });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    const payments = await PaymentService.getAllPayments({ customer_id: customer.id });
    return res.json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

module.exports = { getMyModem, rebootModem, changeWifiPassword, getSummary, getMyInvoices, getMyPayments };
