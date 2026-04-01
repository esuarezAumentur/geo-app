class ListModels {
  constructor(modelRepository) {
    this.modelRepository = modelRepository;
  }

  async execute(filters) {
    return this.modelRepository.findAll(filters);
  }
}

module.exports = ListModels;
