class CreateRoute {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(data) {
    return this.routeRepository.create(data);
  }
}

module.exports = CreateRoute;
