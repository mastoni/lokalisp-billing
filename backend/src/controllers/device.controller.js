const deviceService = require('../services/device.service');

const getAll = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }
    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const device = await deviceService.createDevice(req.body);
    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const customerService = require('../services/customer.service');
const integrationService = require('../services/integration.service');

const getMyDevice = async (req, res) => {
  try {
    const customer = await customerService.findCustomerForUser(req.user);
    if (!customer || !customer.device_id) {
      return res.status(404).json({
        success: false,
        message: 'No device associated with your account',
      });
    }

    const device = await deviceService.getDeviceById(customer.device_id);
    res.status(200).json({
      success: true,
      data: {
        ...device,
        ont_serial_number: customer.ont_serial_number,
        acs_device_id: customer.acs_device_id, // For tracking
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rebootDevice = async (req, res) => {
  try {
    const customer = await customerService.findCustomerForUser(req.user);
    if (!customer || !customer.acs_device_id) {
      return res.status(404).json({
        success: false,
        message: 'Your device is not registered for remote control',
      });
    }

    await deviceService.queueCommand(customer.device_id, 'reboot');
    res.status(200).json({
      success: true,
      message: 'Reboot command has been queued. Your device will reboot shortly.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeWifiPassword = async (req, res) => {
  try {
    const { password, ssid } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    const customer = await customerService.findCustomerForUser(req.user);
    if (!customer || !customer.acs_device_id) {
      return res.status(404).json({
        success: false,
        message: 'Your device is not registered for remote control',
      });
    }

    await deviceService.queueCommand(customer.device_id, 'set_wifi', { password, ssid });
    res.status(200).json({
      success: true,
      message: 'WiFi update command has been queued.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWifiInfo = async (req, res) => {
  try {
    const customer = await customerService.findCustomerForUser(req.user);
    if (!customer || !customer.acs_device_id) {
      return res.status(404).json({
        success: false,
        message: 'Your device is not registered for remote management',
      });
    }

    const wifiInfo = await deviceService.getWifiInfo(customer.acs_device_id);
    res.status(200).json({
      success: true,
      data: wifiInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAll, getById, create, getMyDevice, rebootDevice, changeWifiPassword, getWifiInfo };
