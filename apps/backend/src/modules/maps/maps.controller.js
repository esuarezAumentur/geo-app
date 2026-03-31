const mapsService = require('./maps.service');
const { createMapSchema, updateMapSchema } = require('./maps.schema');
const HTTP_STATUS = require('../../constants/httpStatus');

async function list(req, res, next) {
  try {
    const isAuthenticated = !!req.user;
    const maps = await mapsService.listMaps({ isAuthenticated });
    res.status(HTTP_STATUS.OK).json(maps);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const isAuthenticated = !!req.user;
    const map = await mapsService.getMapById(req.params.id, { isAuthenticated });
    res.status(HTTP_STATUS.OK).json(map);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = createMapSchema.parse(req.body);
    const map = await mapsService.createMap(data, req.user.id);
    res.status(HTTP_STATUS.CREATED).json(map);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updateMapSchema.parse(req.body);
    const map = await mapsService.updateMap(req.params.id, data);
    res.status(HTTP_STATUS.OK).json(map);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await mapsService.deleteMap(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
