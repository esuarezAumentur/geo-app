const MapModel = require('../../../../shared/infrastructure/db/models/MapModel');

class MongoMapRepository {
  async findAll(filter = {}) {
    return MapModel.find(filter).populate('createdBy', 'email').sort({ createdAt: -1 });
  }

  async findById(id) {
    return MapModel.findById(id).populate('createdBy', 'email');
  }

  async create(data) {
    return MapModel.create(data);
  }

  async update(id, data) {
    return MapModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return MapModel.findByIdAndDelete(id);
  }
}

module.exports = MongoMapRepository;
