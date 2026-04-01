const multer = require('multer');
const env = require('../../../../config/env');
const HTTP_STATUS = require('../../../constants/httpStatus');
const MESSAGES = require('../../../constants/messages');

function errorHandler(err, req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(HTTP_STATUS.PAYLOAD_TOO_LARGE).json({ message: MESSAGES.STORAGE_FILE_TOO_LARGE });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.MULTER_ERROR(err.message) });
  }

  const status = err.status || err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.INTERNAL_ERROR;

  if (env.NODE_ENV !== 'production') {
    console.error(`[${req.method}] ${req.path} ->`, err);
  }

  if (err.name === 'ZodError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: MESSAGES.VALIDATION_ERROR,
      // errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.VALIDATION_INVALID_ID });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(HTTP_STATUS.CONFLICT).json({ message: MESSAGES.DUPLICATE_FIELD(field) });
  }

  res.status(status).json({
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
