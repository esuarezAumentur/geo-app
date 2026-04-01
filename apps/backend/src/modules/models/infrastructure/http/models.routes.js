const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const ModelsController = require('./models.controller');

function makeModelsRouter(useCases) {
  const router = Router();
  const controller = new ModelsController(useCases);

  router.get('/', controller.list());
  router.post('/', authenticate, authorize('admin', 'editor'), controller.create());
  router.get('/:id', controller.getOne());
  router.put('/:id', authenticate, authorize('admin', 'editor'), controller.update());
  router.delete('/:id', authenticate, authorize('admin', 'editor'), controller.remove());

  return router;
}

module.exports = makeModelsRouter;
