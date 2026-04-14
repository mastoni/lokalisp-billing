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

module.exports = { test, syncAcs };
