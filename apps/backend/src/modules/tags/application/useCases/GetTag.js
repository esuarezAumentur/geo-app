const { TagNotFoundError } = require('../../domain/TagErrors');

class GetTag {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async execute(id) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) throw new TagNotFoundError();
    return tag;
  }
}

module.exports = GetTag;
