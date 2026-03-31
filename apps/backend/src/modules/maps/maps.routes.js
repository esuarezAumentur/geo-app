const { Router } = require('express');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const optionalAuth = require('../../middlewares/optionalAuth');
const controller = require('./maps.controller');

const router = Router();

// Lectura: sin auth para mapas públicos, con auth para privados
router.get('/', optionalAuth, controller.list);
router.get('/:id', optionalAuth, controller.getOne);

// Escritura: Admin crea/elimina, Admin y Editor actualizan
router.post('/', authenticate, authorize('admin'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'editor'), controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.remove);

module.exports = router;
