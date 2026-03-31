const Map = require('../../models/Map');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

async function listMaps({ isAuthenticated } = {}) {
  const filter = isAuthenticated ? {} : { isPublic: true };
  return Map.find(filter).populate('createdBy', 'email').sort({ createdAt: -1 });
}

async function getMapById(id, { isAuthenticated } = {}) {
  const map = await Map.findById(id).populate('createdBy', 'email');
  if (!map) {
    const err = new Error(MESSAGES.MAP_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  if (!map.isPublic && !isAuthenticated) {
    const err = new Error(MESSAGES.MAP_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return map;
}

async function createMap(data, userId) {
  return Map.create({ ...data, createdBy: userId });
}

async function updateMap(id, data) {
  const map = await Map.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!map) {
    const err = new Error(MESSAGES.MAP_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return map;
}

async function deleteMap(id) {
  const map = await Map.findByIdAndDelete(id);
  if (!map) {
    const err = new Error(MESSAGES.MAP_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
}

module.exports = { listMaps, getMapById, createMap, updateMap, deleteMap };
