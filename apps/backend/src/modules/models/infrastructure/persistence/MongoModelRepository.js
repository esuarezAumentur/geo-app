const Model3DModel = require('../../../../shared/infrastructure/db/models/Model3DModel');

class MongoModelRepository {
  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Model3DModel.find()
        .populate('pointOfInterestId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Model3DModel.countDocuments(),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id) {
    return Model3DModel.findById(id).populate('pointOfInterestId', 'name');
  }

  async create(data) {
    const model = await Model3DModel.create(data);
    return model.populate('pointOfInterestId', 'name');
  }

  async update(id, data) {
    return Model3DModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('pointOfInterestId', 'name');
  }

  async delete(id) {
    return Model3DModel.findByIdAndDelete(id);
  }
}

module.exports = MongoModelRepository;
