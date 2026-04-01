const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createRouteSchema, updateRouteSchema } = require('./routes.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class RoutesController extends BaseController {
  constructor({ listRoutes, getRoute, createRoute, updateRoute, deleteRoute }) {
    super();
    this.listRoutes = listRoutes;
    this.getRoute = getRoute;
    this.createRoute = createRoute;
    this.updateRoute = updateRoute;
    this.deleteRoute = deleteRoute;
  }

  list() {
    return this.handle(async (req, res) => {
      const { page, limit } = req.query;
      const result = await this.listRoutes.execute({ page, limit });
      res.status(HTTP_STATUS.OK).json(result);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const route = await this.getRoute.execute(req.params.id);
      res.status(HTTP_STATUS.OK).json(route);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createRouteSchema.parse(req.body);
      const route = await this.createRoute.execute(data);
      res.status(HTTP_STATUS.CREATED).json(route);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateRouteSchema.parse(req.body);
      const route = await this.updateRoute.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(route);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteRoute.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = RoutesController;
