const jwt = require('jsonwebtoken');
const env = require('../../../../config/env');
const HTTP_STATUS = require('../../../constants/httpStatus');
const MESSAGES = require('../../../constants/messages');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH_TOKEN_REQUIRED });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH_TOKEN_INVALID });
  }
}

module.exports = authenticate;
