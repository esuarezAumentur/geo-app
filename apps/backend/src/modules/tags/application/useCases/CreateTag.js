class CreateTag {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async execute(data) {
    return this.tagRepository.create(data);
  }
}

module.exports = CreateTag;
