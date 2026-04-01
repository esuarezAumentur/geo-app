class ListLocations {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(filters) {
    return this.locationRepository.findAll(filters);
  }
}

module.exports = ListLocations;
