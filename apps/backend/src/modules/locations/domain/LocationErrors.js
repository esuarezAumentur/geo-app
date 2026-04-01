const AppError = require('../../../shared/errors/AppError');

class LocationNotFoundError extends AppError {
  constructor() {
    super('Point of interest not found', 404);
  }
}

module.exports = { LocationNotFoundError };
