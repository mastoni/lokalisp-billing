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

module.exports = { getAll, getById, create };
