const AppError = require('../../../shared/errors/AppError');

class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404);
  }
}

class EmailTakenError extends AppError {
  constructor() {
    super('Email already registered', 409);
  }
}

module.exports = { UserNotFoundError, EmailTakenError };
