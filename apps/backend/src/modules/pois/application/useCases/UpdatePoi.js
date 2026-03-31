const { POINotFoundError } = require('../../domain/POIErrors');

class UpdatePoi {
  constructor(poiRepository) {
    this.poiRepository = poiRepository;
  }

  async execute(mapId, poiId, data) {
    const poi = await this.poiRepository.update(poiId, mapId, data);
    if (!poi) throw new POINotFoundError();
    return poi;
  }
}

module.exports = UpdatePoi;
