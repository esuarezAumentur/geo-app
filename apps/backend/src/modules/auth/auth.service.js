const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const env = require('../../config/env');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

async function register({ email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error(MESSAGES.AUTH_EMAIL_TAKEN);
    err.status = HTTP_STATUS.CONFLICT;
    throw err;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ email, passwordHash, role: role || 'viewer' });
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email, isActive: true }).select('+passwordHash');
  if (!user) {
    const err = new Error(MESSAGES.AUTH_INVALID_CREDENTIALS);
    err.status = HTTP_STATUS.UNAUTHORIZED;
    throw err;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    const err = new Error(MESSAGES.AUTH_INVALID_CREDENTIALS);
    err.status = HTTP_STATUS.UNAUTHORIZED;
    throw err;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { accessToken, refreshToken, user };
}

async function refresh(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    const err = new Error(MESSAGES.AUTH_REFRESH_TOKEN_INVALID);
    err.status = HTTP_STATUS.UNAUTHORIZED;
    throw err;
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    const err = new Error(MESSAGES.USER_NOT_FOUND);
    err.status = HTTP_STATUS.UNAUTHORIZED;
    throw err;
  }

  const accessToken = signAccessToken(user);
  return { accessToken };
}

module.exports = { register, login, refresh };
