const path = require('path');
const fs = require('fs');
const env = require('../../../../config/env');

class DiskStorageAdapter {
  constructor() {
    this.uploadDir = path.resolve(env.UPLOAD_DIR);
  }

  getFilePath(filename) {
    return path.join(this.uploadDir, filename);
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  deleteFile(filePath) {
    fs.unlinkSync(filePath);
  }

  buildPublicUrl(filename) {
    return `${env.PUBLIC_BASE_URL}/api/storage/${filename}`;
  }
}

module.exports = DiskStorageAdapter;
