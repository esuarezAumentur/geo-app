class CreateModel {
  constructor(modelRepository) {
    this.modelRepository = modelRepository;
  }

  async execute(data) {
    return this.modelRepository.create(data);
  }
}

module.exports = CreateModel;
