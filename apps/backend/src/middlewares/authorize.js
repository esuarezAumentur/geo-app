const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

/**
 * Middleware de autorización por rol.
 * Uso: authorize('admin')  o  authorize('admin', 'editor')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH_NOT_AUTHENTICATED });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MESSAGES.AUTH_INSUFFICIENT_PERMISSIONS });
    }
    next();
  };
}

module.exports = authorize;
