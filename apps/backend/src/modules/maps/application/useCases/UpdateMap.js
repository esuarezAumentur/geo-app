const { MapNotFoundError } = require('../../domain/MapErrors');

class UpdateMap {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async execute(id, data) {
    const map = await this.mapRepository.update(id, data);
    if (!map) throw new MapNotFoundError();
    return map;
  }
}

module.exports = UpdateMap;
