const AppError = require('../../../shared/errors/AppError');

class EmailTakenError extends AppError {
  constructor() {
    super('Email already registered', 409);
  }
}

class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 401);
  }
}

class InvalidRefreshTokenError extends AppError {
  constructor() {
    super('Invalid or expired refresh token', 401);
  }
}

class InactiveUserError extends AppError {
  constructor() {
    super('User not found', 401);
  }
}

module.exports = { EmailTakenError, InvalidCredentialsError, InvalidRefreshTokenError, InactiveUserError };
