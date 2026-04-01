const { LocationNotFoundError } = require('../../domain/LocationErrors');

class UpdateLocation {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id, data) {
    const location = await this.locationRepository.update(id, data);
    if (!location) throw new LocationNotFoundError();
    return location;
  }
}

module.exports = UpdateLocation;
