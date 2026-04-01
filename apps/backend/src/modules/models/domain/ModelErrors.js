const AppError = require('../../../shared/errors/AppError');

class ModelNotFoundError extends AppError {
  constructor() {
    super('Model not found', 404);
  }
}

module.exports = { ModelNotFoundError };
