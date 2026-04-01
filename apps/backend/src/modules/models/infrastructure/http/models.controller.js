const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createModelSchema, updateModelSchema } = require('./models.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class ModelsController extends BaseController {
  constructor({ listModels, getModel, createModel, updateModel, deleteModel }) {
    super();
    this.listModels = listModels;
    this.getModel = getModel;
    this.createModel = createModel;
    this.updateModel = updateModel;
    this.deleteModel = deleteModel;
  }

  list() {
    return this.handle(async (req, res) => {
      const { page, limit } = req.query;
      const result = await this.listModels.execute({ page, limit });
      res.status(HTTP_STATUS.OK).json(result);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const model = await this.getModel.execute(req.params.id);
      res.status(HTTP_STATUS.OK).json(model);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createModelSchema.parse(req.body);
      const model = await this.createModel.execute(data);
      res.status(HTTP_STATUS.CREATED).json(model);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateModelSchema.parse(req.body);
      const model = await this.updateModel.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(model);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteModel.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = ModelsController;
