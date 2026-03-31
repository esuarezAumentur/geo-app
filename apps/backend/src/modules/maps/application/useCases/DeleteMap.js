const { MapNotFoundError } = require('../../domain/MapErrors');

class DeleteMap {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async execute(id) {
    const deleted = await this.mapRepository.delete(id);
    if (!deleted) throw new MapNotFoundError();
  }
}

module.exports = DeleteMap;
