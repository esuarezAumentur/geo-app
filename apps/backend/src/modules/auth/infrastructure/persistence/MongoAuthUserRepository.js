const UserModel = require('../../../../shared/infrastructure/db/models/UserModel');

class MongoAuthUserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return UserModel.findOne({ email, isActive: true }).select('+passwordHash');
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async create({ email, passwordHash, role }) {
    return UserModel.create({ email, passwordHash, role });
  }
}

module.exports = MongoAuthUserRepository;
