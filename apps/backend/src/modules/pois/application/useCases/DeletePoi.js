const { POINotFoundError } = require('../../domain/POIErrors');

class DeletePoi {
  constructor(poiRepository) {
    this.poiRepository = poiRepository;
  }

  async execute(mapId, poiId) {
    const deleted = await this.poiRepository.delete(poiId, mapId);
    if (!deleted) throw new POINotFoundError();
  }
}

module.exports = DeletePoi;
