const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createUserSchema, updateUserSchema } = require('./users.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class UsersController extends BaseController {
  constructor({ listUsers, getUser, createUser, updateUser, deleteUser }) {
    super();
    this.listUsers = listUsers;
    this.getUser = getUser;
    this.createUser = createUser;
    this.updateUser = updateUser;
    this.deleteUser = deleteUser;
  }

  list() {
    return this.handle(async (req, res) => {
      const users = await this.listUsers.execute();
      res.status(HTTP_STATUS.OK).json(users);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const user = await this.getUser.execute(req.params.id);
      res.status(HTTP_STATUS.OK).json(user);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createUserSchema.parse(req.body);
      const user = await this.createUser.execute(data);
      res.status(HTTP_STATUS.CREATED).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateUserSchema.parse(req.body);
      const user = await this.updateUser.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(user);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteUser.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = UsersController;
