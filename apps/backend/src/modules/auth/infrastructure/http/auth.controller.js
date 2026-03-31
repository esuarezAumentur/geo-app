const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');
const MESSAGES = require('../../../../shared/constants/messages');

class AuthController extends BaseController {
  constructor({ registerUser, loginUser, refreshToken }) {
    super();
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.refreshToken = refreshToken;
  }

  register() {
    return this.handle(async (req, res) => {
      const data = registerSchema.parse(req.body);
      const user = await this.registerUser.execute(data);
      res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.AUTH_REGISTER_SUCCESS,
        user: { id: user._id, email: user.email, role: user.role },
      });
    });
  }

  login() {
    return this.handle(async (req, res) => {
      const data = loginSchema.parse(req.body);
      const { accessToken, refreshToken: rt, user } = await this.loginUser.execute(data);
      res.status(HTTP_STATUS.OK).json({
        accessToken,
        refreshToken: rt,
        user: { id: user._id, email: user.email, role: user.role },
      });
    });
  }

  refresh() {
    return this.handle(async (req, res) => {
      const { refreshToken: token } = refreshSchema.parse(req.body);
      const result = await this.refreshToken.execute(token);
      res.status(HTTP_STATUS.OK).json(result);
    });
  }
}

module.exports = AuthController;
