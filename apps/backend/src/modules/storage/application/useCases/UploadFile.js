const AppError = require('../../../../shared/errors/AppError');
const MESSAGES = require('../../../../shared/constants/messages');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class UploadFile {
  constructor(storageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  execute(file) {
    if (!file) throw new AppError(MESSAGES.STORAGE_NO_FILE, HTTP_STATUS.BAD_REQUEST);

    return {
      url: this.storageAdapter.buildPublicUrl(file.filename),
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}

module.exports = UploadFile;
