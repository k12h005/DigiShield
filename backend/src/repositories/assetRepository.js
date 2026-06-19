let assets = [];

class AssetRepository {
  async findAllByUserId(userId) {
    return assets.filter(a => a.userId === userId);
  }

  async findById(id) {
    return assets.find(a => a.id === id);
  }

  async create(assetData) {
    const newAsset = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...assetData
    };
    assets.push(newAsset);
    return newAsset;
  }

  async update(id, updateData) {
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updateData };
      return assets[index];
    }
    return null;
  }

  async delete(id) {
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = new AssetRepository();
