const { ModelNotFoundError } = require('../../domain/ModelErrors');

class UpdateModel {
  constructor(modelRepository) {
    this.modelRepository = modelRepository;
  }

  async execute(id, data) {
    const model = await this.modelRepository.update(id, data);
    if (!model) throw new ModelNotFoundError();
    return model;
  }
}

module.exports = UpdateModel;
