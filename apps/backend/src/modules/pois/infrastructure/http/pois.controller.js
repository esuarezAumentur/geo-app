const { z } = require('zod');
const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createPoiSchema, updatePoiSchema } = require('./pois.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class PoisController extends BaseController {
  constructor({ listPois, getPoi, createPoi, updatePoi, deletePoi, reorderPois }) {
    super();
    this.listPois = listPois;
    this.getPoi = getPoi;
    this.createPoi = createPoi;
    this.updatePoi = updatePoi;
    this.deletePoi = deletePoi;
    this.reorderPois = reorderPois;
  }

  list() {
    return this.handle(async (req, res) => {
      const pois = await this.listPois.execute(req.params.mapId);
      res.status(HTTP_STATUS.OK).json(pois);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const poi = await this.getPoi.execute(req.params.mapId, req.params.poiId);
      res.status(HTTP_STATUS.OK).json(poi);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createPoiSchema.parse(req.body);
      const poi = await this.createPoi.execute(req.params.mapId, data);
      res.status(HTTP_STATUS.CREATED).json(poi);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updatePoiSchema.parse(req.body);
      const poi = await this.updatePoi.execute(req.params.mapId, req.params.poiId, data);
      res.status(HTTP_STATUS.OK).json(poi);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deletePoi.execute(req.params.mapId, req.params.poiId);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }

  reorder() {
    return this.handle(async (req, res) => {
      const { orderedIds } = z.object({ orderedIds: z.array(z.string()) }).parse(req.body);
      const pois = await this.reorderPois.execute(req.params.mapId, orderedIds);
      res.status(HTTP_STATUS.OK).json(pois);
    });
  }
}

module.exports = PoisController;
