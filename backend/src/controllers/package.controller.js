const packageService = require('../services/package.service');

const getAll = async (req, res) => {
  try {
    const { is_active } = req.query;
    const packages = await packageService.getAll({ is_active });
    res.status(200).json({
      success: true,
      data: packages,
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
    const packageData = await packageService.getById(id);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }
    res.status(200).json({
      success: true,
      data: packageData,
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
    const packageData = await packageService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: packageData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await packageService.update(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: packageData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await packageService.delete(id);
    res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAll, getById, create, update, delete: deleteById };
