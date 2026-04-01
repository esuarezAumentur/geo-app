class ListRoutes {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(filters) {
    return this.routeRepository.findAll(filters);
  }
}

module.exports = ListRoutes;
