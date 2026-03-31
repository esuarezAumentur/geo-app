const { MapNotFoundError } = require('../../domain/POIErrors');

class CreatePoi {
  constructor(poiRepository, mapRepository) {
    this.poiRepository = poiRepository;
    this.mapRepository = mapRepository;
  }

  async execute(mapId, data) {
    const map = await this.mapRepository.findById(mapId);
    if (!map) throw new MapNotFoundError();
    return this.poiRepository.create({ ...data, mapId });
  }
}

module.exports = CreatePoi;
