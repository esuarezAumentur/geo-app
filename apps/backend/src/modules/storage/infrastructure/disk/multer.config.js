const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const env = require('../../../../config/env');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');
const MESSAGES = require('../../../../shared/constants/messages');

const ALLOWED_MIMES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/vnd.google-earth.kml+xml': '.kml',
  'text/xml': '.kml',
  'application/xml': '.kml',
  'model/gltf+json': '.gltf',
  'model/gltf-binary': '.glb',
  'application/octet-stream': '.glb',
};

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = path.resolve(env.UPLOAD_DIR);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const ext = ALLOWED_MIMES[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIMES[file.mimetype]) {
    cb(null, true);
  } else {
    const err = new Error(`${MESSAGES.STORAGE_FILE_TYPE_NOT_ALLOWED}: ${file.mimetype}`);
    err.status = HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE;
    cb(err);
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE_BYTES } });

module.exports = { upload, ALLOWED_MIMES };
