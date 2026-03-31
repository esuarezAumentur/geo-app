const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../../../../config/env');
const { InvalidCredentialsError } = require('../../domain/AuthErrors');

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { sub: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken, user };
  }
}

module.exports = LoginUser;
