const assetRepository = require('../repositories/assetRepository');
const riskScoringService = require('./riskScoringService');

class AssetService {
  async getUserAssets(userId) {
    return await assetRepository.findAllByUserId(userId);
  }

  async addAsset(userId, assetData) {
    const asset = await assetRepository.create({
      userId,
      ...assetData,
      status: 'monitored',
      lastChecked: new Date()
    });

    // Simulate initial check
    this.triggerInitialCheck(asset);

    return asset;
  }

  async triggerInitialCheck(asset) {
    console.log(`[Monitoring] Initial check triggered for asset: ${asset.value}`);
    // This would call external APIs like HIBP or internal databases
  }

  async deleteAsset(id, userId) {
    const asset = await assetRepository.findById(id);
    if (!asset || asset.userId !== userId) {
      throw new Error('Asset not found or unauthorized');
    }
    return await assetRepository.delete(id);
  }
}

module.exports = new AssetService();
