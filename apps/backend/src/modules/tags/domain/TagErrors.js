const AppError = require('../../../shared/errors/AppError');

class TagNotFoundError extends AppError {
  constructor() {
    super('Tag not found', 404);
  }
}

module.exports = { TagNotFoundError };
