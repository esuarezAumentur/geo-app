const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createLocationSchema, updateLocationSchema } = require('./locations.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class LocationsController extends BaseController {
  constructor({ listLocations, getLocation, createLocation, updateLocation, deleteLocation }) {
    super();
    this.listLocations = listLocations;
    this.getLocation = getLocation;
    this.createLocation = createLocation;
    this.updateLocation = updateLocation;
    this.deleteLocation = deleteLocation;
  }

  list() {
    return this.handle(async (req, res) => {
      const { page, limit, tag, model, visible } = req.query;
      const result = await this.listLocations.execute({ page, limit, tag, model, visible });
      res.status(HTTP_STATUS.OK).json(result);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const location = await this.getLocation.execute(req.params.id);
      res.status(HTTP_STATUS.OK).json(location);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createLocationSchema.parse(req.body);
      const location = await this.createLocation.execute(data);
      res.status(HTTP_STATUS.CREATED).json(location);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateLocationSchema.parse(req.body);
      const location = await this.updateLocation.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(location);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteLocation.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = LocationsController;
