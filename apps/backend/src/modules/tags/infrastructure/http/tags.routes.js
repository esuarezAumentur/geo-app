const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const TagsController = require('./tags.controller');

function makeTagsRouter(useCases) {
  const router = Router();
  const controller = new TagsController(useCases);

  router.get('/', controller.list());
  router.post('/', authenticate, authorize('admin'), controller.create());
  router.get('/:id', controller.getOne());
  router.put('/:id', authenticate, authorize('admin'), controller.update());
  router.delete('/:id', authenticate, authorize('admin'), controller.remove());

  return router;
}

module.exports = makeTagsRouter;
