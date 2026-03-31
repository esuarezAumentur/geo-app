const AppError = require('../../../../shared/errors/AppError');
const MESSAGES = require('../../../../shared/constants/messages');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class DeleteFile {
  constructor(storageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  execute(filename) {
    if (filename.includes('..') || filename.includes('/')) {
      throw new AppError(MESSAGES.STORAGE_INVALID_FILENAME, HTTP_STATUS.BAD_REQUEST);
    }

    const filePath = this.storageAdapter.getFilePath(filename);
    if (!this.storageAdapter.fileExists(filePath)) {
      throw new AppError(MESSAGES.STORAGE_FILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    this.storageAdapter.deleteFile(filePath);
  }
}

module.exports = DeleteFile;
