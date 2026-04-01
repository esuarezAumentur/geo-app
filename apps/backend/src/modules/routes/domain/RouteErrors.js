const AppError = require('../../../shared/errors/AppError');

class RouteNotFoundError extends AppError {
  constructor() {
    super('Route not found', 404);
  }
}

module.exports = { RouteNotFoundError };
