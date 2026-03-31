const { MapNotFoundError } = require('../../domain/POIErrors');

class ListPois {
  constructor(poiRepository, mapRepository) {
    this.poiRepository = poiRepository;
    this.mapRepository = mapRepository;
  }

  async execute(mapId) {
    const map = await this.mapRepository.findById(mapId);
    if (!map) throw new MapNotFoundError();
    return this.poiRepository.findByMapId(mapId);
  }
}

module.exports = ListPois;
