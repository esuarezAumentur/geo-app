const RouteModel = require('../../../../shared/infrastructure/db/models/RouteModel');

class MongoRouteRepository {
  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      RouteModel.find()
        .populate('waypoints', 'name coordinates')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RouteModel.countDocuments(),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id) {
    return RouteModel.findById(id).populate('waypoints', 'name coordinates');
  }

  async create(data) {
    const route = await RouteModel.create(data);
    return route.populate('waypoints', 'name coordinates');
  }

  async update(id, data) {
    return RouteModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('waypoints', 'name coordinates');
  }

  async delete(id) {
    return RouteModel.findByIdAndDelete(id);
  }
}

module.exports = MongoRouteRepository;
