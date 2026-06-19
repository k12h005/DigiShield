const fs = require('fs');
const path = require('path');
const assetRepository = require('../repositories/assetRepository');
const alertRepository = require('../repositories/alertRepository');
const breachIntelligenceService = require('./BreachIntelligenceService');
const recommendationService = require('./recommendationService');

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

    // Integrated scan using the unified Breach Intelligence Service
    await this.scanAsset(asset);

    return asset;
  }

  async scanAsset(asset) {
    try {
      const breaches = breachIntelligenceService.getAllBreaches();
      
      // Simple heuristic for hackathon: Match asset domain or email domain with breach domains
      let assetDomain = '';
      if (asset.type === 'email') {
        assetDomain = asset.value.split('@')[1];
      } else if (asset.type === 'domain') {
        assetDomain = asset.value;
      }

      if (assetDomain) {
        const potentialBreaches = breaches.filter(b => b.Domain.toLowerCase() === assetDomain.toLowerCase());
        
        for (const breach of potentialBreaches) {
          const riskInfo = breachIntelligenceService.calculateRiskScore(breach.DataClasses);
          const recommendations = recommendationService.getRecommendations(
            breach.DataClasses.map(dc => dc.toLowerCase().includes('password') ? 'password' : dc.toLowerCase())
          );

          await alertRepository.create({
            userId: asset.userId,
            asset: asset.value,
            source: breach.Title,
            severity: riskInfo.severity,
            date: breach.BreachDate,
            exposedDataTypes: breach.DataClasses,
            recommendations: recommendations,
            description: breach.Description
          });
        }
      }
    } catch (error) {
      console.error('[AssetService] Error during scan:', error);
    }
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
