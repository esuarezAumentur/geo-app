const { MapNotFoundError } = require('../../domain/MapErrors');

class GetMap {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async execute(id, { isAuthenticated } = {}) {
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundError();
    if (!map.isPublic && !isAuthenticated) throw new MapNotFoundError();
    return map;
  }
}

module.exports = GetMap;
