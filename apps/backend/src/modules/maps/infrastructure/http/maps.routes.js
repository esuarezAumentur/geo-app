const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const optionalAuth = require('../../../../shared/infrastructure/http/middlewares/optionalAuth');
const MapsController = require('./maps.controller');

function makeMapsRouter(useCases) {
  const router = Router();
  const controller = new MapsController(useCases);

  router.get('/', optionalAuth, controller.list());
  router.get('/:id', optionalAuth, controller.getOne());
  router.post('/', authenticate, authorize('admin'), controller.create());
  router.put('/:id', authenticate, authorize('admin', 'editor'), controller.update());
  router.delete('/:id', authenticate, authorize('admin'), controller.remove());

  return router;
}

module.exports = makeMapsRouter;
