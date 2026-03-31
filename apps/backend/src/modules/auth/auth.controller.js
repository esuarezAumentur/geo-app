const authService = require('./auth.service');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.schema');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.AUTH_REGISTER_SUCCESS,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await authService.login(data);
    res.status(HTTP_STATUS.OK).json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await authService.refresh(refreshToken);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh };
