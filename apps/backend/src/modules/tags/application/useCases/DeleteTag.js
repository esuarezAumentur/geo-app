const { TagNotFoundError } = require('../../domain/TagErrors');

class DeleteTag {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async execute(id) {
    const deleted = await this.tagRepository.delete(id);
    if (!deleted) throw new TagNotFoundError();
  }
}

module.exports = DeleteTag;
