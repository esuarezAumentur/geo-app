const jwt = require('jsonwebtoken');
const env = require('../../../../config/env');
const { InvalidRefreshTokenError, InactiveUserError } = require('../../domain/AuthErrors');

class RefreshToken {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(token) {
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.isActive) throw new InactiveUserError();

    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { accessToken };
  }
}

module.exports = RefreshToken;
