const { Router } = require('express');
const AuthController = require('./auth.controller');

function makeAuthRouter(useCases) {
  const router = Router();
  const controller = new AuthController(useCases);

  router.post('/register', controller.register());
  router.post('/login', controller.login());
  router.post('/refresh', controller.refresh());

  return router;
}

module.exports = makeAuthRouter;
