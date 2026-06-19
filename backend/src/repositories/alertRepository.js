const FileDB = require('../utils/fileDB');
const alertDB = new FileDB('alerts_repo');

class AlertRepository {
  async findAllByUserId(userId) {
    return await alertDB.findMany({ userId });
  }

  async create(alertData) {
    return await alertDB.create(alertData);
  }

  async updateStatus(id, status) {
    return await alertDB.update(id, { status });
  }
}

module.exports = new AlertRepository();
