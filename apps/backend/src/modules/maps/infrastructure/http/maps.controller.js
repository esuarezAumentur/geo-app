const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createMapSchema, updateMapSchema } = require('./maps.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class MapsController extends BaseController {
  constructor({ listMaps, getMap, createMap, updateMap, deleteMap }) {
    super();
    this.listMaps = listMaps;
    this.getMap = getMap;
    this.createMap = createMap;
    this.updateMap = updateMap;
    this.deleteMap = deleteMap;
  }

  list() {
    return this.handle(async (req, res) => {
      const maps = await this.listMaps.execute({ isAuthenticated: !!req.user });
      res.status(HTTP_STATUS.OK).json(maps);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const map = await this.getMap.execute(req.params.id, { isAuthenticated: !!req.user });
      res.status(HTTP_STATUS.OK).json(map);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createMapSchema.parse(req.body);
      const map = await this.createMap.execute(data, req.user.id);
      res.status(HTTP_STATUS.CREATED).json(map);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateMapSchema.parse(req.body);
      const map = await this.updateMap.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(map);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteMap.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = MapsController;
