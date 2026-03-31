const jwt = require('jsonwebtoken');
const env = require('../../../../config/env');

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // token inválido → continuar sin usuario
    }
  }
  next();
}

module.exports = optionalAuth;
