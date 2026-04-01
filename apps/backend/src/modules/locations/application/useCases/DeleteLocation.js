const { LocationNotFoundError } = require('../../domain/LocationErrors');

class DeleteLocation {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id) {
    const deleted = await this.locationRepository.delete(id);
    if (!deleted) throw new LocationNotFoundError();
  }
}

module.exports = DeleteLocation;
