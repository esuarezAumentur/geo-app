const { ModelNotFoundError } = require('../../domain/ModelErrors');

class DeleteModel {
  constructor(modelRepository) {
    this.modelRepository = modelRepository;
  }

  async execute(id) {
    const deleted = await this.modelRepository.delete(id);
    if (!deleted) throw new ModelNotFoundError();
  }
}

module.exports = DeleteModel;
