const poisService = require('./pois.service');
const { createPoiSchema, updatePoiSchema } = require('./pois.schema');
const { z } = require('zod');
const HTTP_STATUS = require('../../constants/httpStatus');

async function list(req, res, next) {
  try {
    const pois = await poisService.listPois(req.params.mapId);
    res.status(HTTP_STATUS.OK).json(pois);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const poi = await poisService.getPoiById(req.params.mapId, req.params.poiId);
    res.status(HTTP_STATUS.OK).json(poi);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = createPoiSchema.parse(req.body);
    const poi = await poisService.createPoi(req.params.mapId, data);
    res.status(HTTP_STATUS.CREATED).json(poi);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updatePoiSchema.parse(req.body);
    const poi = await poisService.updatePoi(req.params.mapId, req.params.poiId, data);
    res.status(HTTP_STATUS.OK).json(poi);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await poisService.deletePoi(req.params.mapId, req.params.poiId);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

async function reorder(req, res, next) {
  try {
    const { orderedIds } = z.object({ orderedIds: z.array(z.string()) }).parse(req.body);
    const pois = await poisService.reorderPois(req.params.mapId, orderedIds);
    res.status(HTTP_STATUS.OK).json(pois);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove, reorder };
