const FileDB = require('../utils/fileDB');
const auditDB = new FileDB('audit');

class AuditLogRepository {
  async create(logData) {
    return await auditDB.create(logData);
  }

  async findByUserId(userId) {
    return await auditDB.findMany({ userId });
  }
}

module.exports = new AuditLogRepository();
