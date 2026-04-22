const IntegrationService = require('../services/integration.service');
const DeviceService = require('../services/device.service');

const test = async (req, res) => {
  try {
    const provider = req.params.provider;
    const result = await IntegrationService.test(provider);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Test failed',
        details: result.details,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      details: result.details,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const syncAcs = async (req, res) => {
  try {
    const result = await DeviceService.syncWithAcs();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to sync with GenieACS',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getAcsDevices = async (req, res) => {
  try {
    const devices = await IntegrationService.getAcsDevices(req.query);
    return res.json(devices);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch GenieACS devices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getMikrotikData = async (req, res) => {
  try {
    const { type } = req.query;
    let data;

    switch (type) {
      case 'resource':
        data = await IntegrationService.getMikrotikResource();
        break;
      case 'pppoe':
        data = await IntegrationService.getMikrotikPppoe();
        break;
      case 'hotspot':
        data = await IntegrationService.getMikrotikHotspot();
        break;
      case 'active':
        data = await IntegrationService.getMikrotikActive();
        break;
      case 'active-hotspot':
        data = await IntegrationService.getMikrotikActiveHotspot();
        break;
      case 'profiles':
        data = await IntegrationService.getMikrotikProfiles();
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch MikroTik data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { test, syncAcs, getAcsDevices, getMikrotikData };
