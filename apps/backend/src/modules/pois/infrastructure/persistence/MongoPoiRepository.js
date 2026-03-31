const POIModel = require('../../../../shared/infrastructure/db/models/POIModel');

class MongoPoiRepository {
  async findByMapId(mapId) {
    return POIModel.find({ mapId }).sort({ order: 1, createdAt: 1 });
  }

  async findByIdAndMapId(id, mapId) {
    return POIModel.findOne({ _id: id, mapId });
  }

  async create(data) {
    return POIModel.create(data);
  }

  async update(id, mapId, data) {
    return POIModel.findOneAndUpdate(
      { _id: id, mapId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id, mapId) {
    return POIModel.findOneAndDelete({ _id: id, mapId });
  }

  async reorder(mapId, orderedIds) {
    const updates = orderedIds.map((id, index) =>
      POIModel.updateOne({ _id: id, mapId }, { order: index })
    );
    await Promise.all(updates);
    return POIModel.find({ mapId }).sort({ order: 1 });
  }
}

module.exports = MongoPoiRepository;
