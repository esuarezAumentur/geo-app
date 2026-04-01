const BaseController = require('../../../../shared/infrastructure/http/BaseController');
const { createTagSchema, updateTagSchema } = require('./tags.schema');
const HTTP_STATUS = require('../../../../shared/constants/httpStatus');

class TagsController extends BaseController {
  constructor({ listTags, getTag, createTag, updateTag, deleteTag }) {
    super();
    this.listTags = listTags;
    this.getTag = getTag;
    this.createTag = createTag;
    this.updateTag = updateTag;
    this.deleteTag = deleteTag;
  }

  list() {
    return this.handle(async (req, res) => {
      const tags = await this.listTags.execute();
      res.status(HTTP_STATUS.OK).json(tags);
    });
  }

  getOne() {
    return this.handle(async (req, res) => {
      const tag = await this.getTag.execute(req.params.id);
      res.status(HTTP_STATUS.OK).json(tag);
    });
  }

  create() {
    return this.handle(async (req, res) => {
      const data = createTagSchema.parse(req.body);
      const tag = await this.createTag.execute(data);
      res.status(HTTP_STATUS.CREATED).json(tag);
    });
  }

  update() {
    return this.handle(async (req, res) => {
      const data = updateTagSchema.parse(req.body);
      const tag = await this.updateTag.execute(req.params.id, data);
      res.status(HTTP_STATUS.OK).json(tag);
    });
  }

  remove() {
    return this.handle(async (req, res) => {
      await this.deleteTag.execute(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    });
  }
}

module.exports = TagsController;
