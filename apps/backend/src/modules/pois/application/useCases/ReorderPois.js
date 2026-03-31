const { MapNotFoundError } = require('../../domain/POIErrors');

class ReorderPois {
  constructor(poiRepository, mapRepository) {
    this.poiRepository = poiRepository;
    this.mapRepository = mapRepository;
  }

  async execute(mapId, orderedIds) {
    const map = await this.mapRepository.findById(mapId);
    if (!map) throw new MapNotFoundError();
    return this.poiRepository.reorder(mapId, orderedIds);
  }
}

module.exports = ReorderPois;
