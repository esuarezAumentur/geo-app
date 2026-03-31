const AppError = require('../../../shared/errors/AppError');

class MapNotFoundError extends AppError {
  constructor() {
    super('Map not found', 404);
  }
}

module.exports = { MapNotFoundError };
