const path = require('path');
const fs = require('fs');
const env = require('../../config/env');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.STORAGE_NO_FILE });
    }

    const url = `${env.PUBLIC_BASE_URL}/api/storage/${req.file.filename}`;

    res.status(HTTP_STATUS.CREATED).json({
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { filename } = req.params;

    if (filename.includes('..') || filename.includes('/')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.STORAGE_INVALID_FILENAME });
    }

    const filePath = path.join(path.resolve(env.UPLOAD_DIR), filename);

    if (!fs.existsSync(filePath)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STORAGE_FILE_NOT_FOUND });
    }

    fs.unlinkSync(filePath);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

function download(req, res, next) {
  try {
    const { filename } = req.params;

    if (filename.includes('..') || filename.includes('/')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.STORAGE_INVALID_FILENAME });
    }

    const filePath = path.resolve(env.UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STORAGE_FILE_NOT_FOUND });
    }

    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, remove, download };
