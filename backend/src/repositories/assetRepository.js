const FileDB = require('../utils/fileDB');
const assetDB = new FileDB('assets');

class AssetRepository {
  async findAllByUserId(userId) {
    return await assetDB.findMany({ userId });
  }

  async findById(id) {
    return await assetDB.findUnique({ id });
  }

  async create(assetData) {
    return await assetDB.create(assetData);
  }

  async delete(id) {
    return await assetDB.delete(id);
  }

  async updateLastChecked(id) {
    return await assetDB.update(id, { lastChecked: new Date().toISOString() });
  }
}

module.exports = new AssetRepository();
