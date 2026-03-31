const { POINotFoundError } = require('../../domain/POIErrors');

class GetPoi {
  constructor(poiRepository) {
    this.poiRepository = poiRepository;
  }

  async execute(mapId, poiId) {
    const poi = await this.poiRepository.findByIdAndMapId(poiId, mapId);
    if (!poi) throw new POINotFoundError();
    return poi;
  }
}

module.exports = GetPoi;
