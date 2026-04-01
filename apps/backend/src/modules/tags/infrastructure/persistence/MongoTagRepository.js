const TagModel = require('../../../../shared/infrastructure/db/models/TagModel');

class MongoTagRepository {
  async findAll() {
    return TagModel.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return TagModel.findById(id);
  }

  async create(data) {
    return TagModel.create(data);
  }

  async update(id, data) {
    return TagModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return TagModel.findByIdAndDelete(id);
  }
}

module.exports = MongoTagRepository;
