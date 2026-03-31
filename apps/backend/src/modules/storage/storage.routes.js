const { Router } = require('express');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const optionalAuth = require('../../middlewares/optionalAuth');
const { upload } = require('./storage.multer');
const controller = require('./storage.controller');

const router = Router();

router.post(
  '/upload',
  authenticate,
  authorize('admin', 'editor'),
  upload.single('file'),
  controller.upload
);

router.get(
  '/:filename',
  optionalAuth,
  controller.download
);

router.delete(
  '/:filename',
  authenticate,
  authorize('admin', 'editor'),
  controller.remove
);

module.exports = router;
