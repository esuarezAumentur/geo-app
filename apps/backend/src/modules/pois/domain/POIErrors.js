const AppError = require('../../../shared/errors/AppError');

class POINotFoundError extends AppError {
  constructor() {
    super('POI not found', 404);
  }
}

class MapNotFoundError extends AppError {
  constructor() {
    super('Map not found', 404);
  }
}

module.exports = { POINotFoundError, MapNotFoundError };
