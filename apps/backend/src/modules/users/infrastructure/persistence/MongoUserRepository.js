const UserModel = require('../../../../shared/infrastructure/db/models/UserModel');

class MongoUserRepository {
  async findAll() {
    return UserModel.find({}, '-passwordHash').sort({ createdAt: -1 });
  }

  async findById(id) {
    return UserModel.findById(id, '-passwordHash');
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create({ name, email, passwordHash, role }) {
    return UserModel.create({ name, email, passwordHash, role });
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-passwordHash');
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

module.exports = MongoUserRepository;
