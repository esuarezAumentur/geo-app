class ListMaps {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async execute({ isAuthenticated } = {}) {
    const filter = isAuthenticated ? {} : { isPublic: true };
    return this.mapRepository.findAll(filter);
  }
}

module.exports = ListMaps;
