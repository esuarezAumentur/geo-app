const { RouteNotFoundError } = require('../../domain/RouteErrors');

class UpdateRoute {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(id, data) {
    const route = await this.routeRepository.update(id, data);
    if (!route) throw new RouteNotFoundError();
    return route;
  }
}

module.exports = UpdateRoute;
