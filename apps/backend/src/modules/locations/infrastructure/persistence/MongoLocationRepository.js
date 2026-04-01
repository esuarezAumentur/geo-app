const PointOfInterestModel = require('../../../../shared/infrastructure/db/models/LocationModel');

class MongoLocationRepository {
  async findAll({ page = 1, limit = 10, tag, model, visible } = {}) {
    const filter = {};

    if (tag) filter.tagId = tag;
    if (model === 'true') filter.modelId = { $ne: null };
    if (model === 'false') filter.modelId = null;
    if (visible === 'true') filter.isVisible = true;
    if (visible === 'false') filter.isVisible = false;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      PointOfInterestModel.find(filter)
        .populate('tagId', 'name color')
        .populate('modelId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      PointOfInterestModel.countDocuments(filter),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id) {
    return PointOfInterestModel.findById(id)
      .populate('tagId', 'name color')
      .populate('modelId', 'name');
  }

  async create(data) {
    const location = await PointOfInterestModel.create(data);
    return location.populate(['tagId', 'modelId']);
  }

  async update(id, data) {
    return PointOfInterestModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('tagId', 'name color')
      .populate('modelId', 'name');
  }

  async delete(id) {
    return PointOfInterestModel.findByIdAndDelete(id);
  }
}

module.exports = MongoLocationRepository;
