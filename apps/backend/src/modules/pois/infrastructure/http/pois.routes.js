const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const optionalAuth = require('../../../../shared/infrastructure/http/middlewares/optionalAuth');
const PoisController = require('./pois.controller');

function makePoisRouter(useCases) {
  const router = Router({ mergeParams: true });
  const controller = new PoisController(useCases);

  router.get('/:mapId/pois', optionalAuth, controller.list());
  router.get('/:mapId/pois/:poiId', optionalAuth, controller.getOne());
  router.post('/:mapId/pois', authenticate, authorize('admin', 'editor'), controller.create());
  router.put('/:mapId/pois/:poiId', authenticate, authorize('admin', 'editor'), controller.update());
  router.delete('/:mapId/pois/:poiId', authenticate, authorize('admin', 'editor'), controller.remove());
  router.post('/:mapId/pois/reorder', authenticate, authorize('admin', 'editor'), controller.reorder());

  return router;
}

module.exports = makePoisRouter;
