const { RouteNotFoundError } = require('../../domain/RouteErrors');

class DeleteRoute {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(id) {
    const deleted = await this.routeRepository.delete(id);
    if (!deleted) throw new RouteNotFoundError();
  }
}

module.exports = DeleteRoute;
