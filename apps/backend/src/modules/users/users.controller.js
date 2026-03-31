const usersService = require('./users.service');
const { createUserSchema, updateUserSchema } = require('./users.schema');
const HTTP_STATUS = require('../../constants/httpStatus');

async function list(req, res, next) {
  try {
    const users = await usersService.listUsers();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await usersService.createUser(data);
    res.status(HTTP_STATUS.CREATED).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await usersService.updateUser(req.params.id, data);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
