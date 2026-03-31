class BaseController {
  /**
   * Wraps an async route handler eliminating the repetitive try/catch boilerplate.
   * Errors are forwarded to Express's next() so the global errorHandler picks them up.
   *
   * Usage inside a subclass:
   *   someAction() {
   *     return this.handle(async (req, res) => {
   *       // pure logic: validate → execute → respond
   *     });
   *   }
   */
  handle(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}

module.exports = BaseController;
