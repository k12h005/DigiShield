// Internal mock storage for hackathon demonstration
// This will be replaced by Sequelize models in production.
let users = [];

class UserRepository {
  async findByEmail(email) {
    return users.find(u => u.email === email);
  }

  async findById(id) {
    return users.find(u => u.id === id);
  }

  async create(userData) {
    const newUser = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...userData
    };
    users.push(newUser);
    return newUser;
  }
}

module.exports = new UserRepository();
