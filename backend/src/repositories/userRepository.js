const FileDB = require('../utils/fileDB');
const userDB = new FileDB('users');

class UserRepository {
  async findByEmail(email) {
    return await userDB.findUnique({ email });
  }

  async findById(id) {
    return await userDB.findUnique({ id });
  }

  async create(userData) {
    return await userDB.create(userData);
  }
}

module.exports = new UserRepository();
