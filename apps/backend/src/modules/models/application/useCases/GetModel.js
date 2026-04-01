const { ModelNotFoundError } = require('../../domain/ModelErrors');

class GetModel {
  constructor(modelRepository) {
    this.modelRepository = modelRepository;
  }

  async execute(id) {
    const model = await this.modelRepository.findById(id);
    if (!model) throw new ModelNotFoundError();
    return model;
  }
}

module.exports = GetModel;
