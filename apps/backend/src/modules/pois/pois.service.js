const POI = require('../../models/POI');
const Map = require('../../models/Map');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

async function assertMapExists(mapId) {
  const map = await Map.findById(mapId);
  if (!map) {
    const err = new Error(MESSAGES.MAP_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return map;
}

async function listPois(mapId) {
  await assertMapExists(mapId);
  return POI.find({ mapId }).sort({ order: 1, createdAt: 1 });
}

async function getPoiById(mapId, poiId) {
  const poi = await POI.findOne({ _id: poiId, mapId });
  if (!poi) {
    const err = new Error(MESSAGES.POI_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return poi;
}

async function createPoi(mapId, data) {
  await assertMapExists(mapId);
  return POI.create({ ...data, mapId });
}

async function updatePoi(mapId, poiId, data) {
  const poi = await POI.findOneAndUpdate(
    { _id: poiId, mapId },
    data,
    { new: true, runValidators: true }
  );
  if (!poi) {
    const err = new Error(MESSAGES.POI_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return poi;
}

async function deletePoi(mapId, poiId) {
  const poi = await POI.findOneAndDelete({ _id: poiId, mapId });
  if (!poi) {
    const err = new Error(MESSAGES.POI_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
}

async function reorderPois(mapId, orderedIds) {
  await assertMapExists(mapId);
  const updates = orderedIds.map((id, index) =>
    POI.updateOne({ _id: id, mapId }, { order: index })
  );
  await Promise.all(updates);
  return POI.find({ mapId }).sort({ order: 1 });
}

module.exports = { listPois, getPoiById, createPoi, updatePoi, deletePoi, reorderPois };
