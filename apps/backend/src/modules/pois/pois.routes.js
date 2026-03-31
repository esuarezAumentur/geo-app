const { Router } = require('express');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const optionalAuth = require('../../middlewares/optionalAuth');
const controller = require('./pois.controller');

const router = Router({ mergeParams: true });

router.get('/:mapId/pois', optionalAuth, controller.list);
router.get('/:mapId/pois/:poiId', optionalAuth, controller.getOne);

router.post('/:mapId/pois', authenticate, authorize('admin', 'editor'), controller.create);
router.put('/:mapId/pois/:poiId', authenticate, authorize('admin', 'editor'), controller.update);
router.delete('/:mapId/pois/:poiId', authenticate, authorize('admin', 'editor'), controller.remove);
router.post('/:mapId/pois/reorder', authenticate, authorize('admin', 'editor'), controller.reorder);

module.exports = router;
