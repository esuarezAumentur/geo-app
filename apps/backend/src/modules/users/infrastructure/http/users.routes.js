const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const UsersController = require('./users.controller');

function makeUsersRouter(useCases) {
  const router = Router();
  const controller = new UsersController(useCases);

  router.use(authenticate, authorize('admin'));

  router.get('/', controller.list());
  router.post('/', controller.create());
  router.get('/:id', controller.getOne());
  router.put('/:id', controller.update());
  router.delete('/:id', controller.remove());

  return router;
}

module.exports = makeUsersRouter;
