const { Router } = require('express');
const authenticate = require('../../../../shared/infrastructure/http/middlewares/authenticate');
const authorize = require('../../../../shared/infrastructure/http/middlewares/authorize');
const optionalAuth = require('../../../../shared/infrastructure/http/middlewares/optionalAuth');
const StorageController = require('./storage.controller');

function makeStorageRouter(useCases, upload) {
  const router = Router();
  const controller = new StorageController(useCases);

  router.post(
    '/upload',
    authenticate,
    authorize('admin', 'editor'),
    upload.single('file'),
    controller.upload()
  );

  router.get('/:filename', optionalAuth, controller.download());

  router.delete(
    '/:filename',
    authenticate,
    authorize('admin', 'editor'),
    controller.remove()
  );

  return router;
}

module.exports = makeStorageRouter;
