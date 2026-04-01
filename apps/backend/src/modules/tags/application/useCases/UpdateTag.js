const { TagNotFoundError } = require('../../domain/TagErrors');

class UpdateTag {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async execute(id, data) {
    const tag = await this.tagRepository.update(id, data);
    if (!tag) throw new TagNotFoundError();
    return tag;
  }
}

module.exports = UpdateTag;
