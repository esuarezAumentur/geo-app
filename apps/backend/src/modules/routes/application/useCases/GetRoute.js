const { RouteNotFoundError } = require('../../domain/RouteErrors');

class GetRoute {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(id) {
    const route = await this.routeRepository.findById(id);
    if (!route) throw new RouteNotFoundError();
    return route;
  }
}

module.exports = GetRoute;
