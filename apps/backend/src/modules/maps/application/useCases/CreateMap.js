class CreateMap {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async execute(data, userId) {
    return this.mapRepository.create({ ...data, createdBy: userId });
  }
}

module.exports = CreateMap;
