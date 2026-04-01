class CreateLocation {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(data) {
    return this.locationRepository.create(data);
  }
}

module.exports = CreateLocation;
