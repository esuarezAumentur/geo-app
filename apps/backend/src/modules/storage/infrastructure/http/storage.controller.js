const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class StorageController extends BaseController {
  constructor({ uploadFile, downloadFile, deleteFile }) {
    super();
    this.uploadFile = uploadFile;
    this.downloadFile = downloadFile;
    this.deleteFile = deleteFile;
  }

  upload() {
    return this.handle((req, res) => {
      const result = this.uploadFile.execute(req.file);
      res.status(HTTP_STATUS.CREATED).json(result);
    });
  }

  download() {
    return this.handle((req, res) => {
      const filePath = this.downloadFile.execute(req.params.filename);
      res.sendFile(filePath);
    });
  }

  remove() {
    return this.handle((req, res) => {
      this.deleteFile.execute(req.params.filename);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = StorageController;
