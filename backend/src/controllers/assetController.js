const assetService = require('../services/assetService');

const getAssets = async (req, res, next) => {
  try {
    const assets = await assetService.getUserAssets(req.user.id);
    res.json(assets);
  } catch (error) {
    next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const asset = await assetService.addAsset(req.user.id, req.body);
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    await assetService.deleteAsset(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAssets, createAsset, deleteAsset };
