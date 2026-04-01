const { LocationNotFoundError } = require('../../domain/LocationErrors');

class GetLocation {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id) {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new LocationNotFoundError();
    return location;
  }
}

module.exports = GetLocation;
