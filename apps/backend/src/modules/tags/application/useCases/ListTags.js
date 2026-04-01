class ListTags {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async execute() {
    return this.tagRepository.findAll();
  }
}

module.exports = ListTags;
