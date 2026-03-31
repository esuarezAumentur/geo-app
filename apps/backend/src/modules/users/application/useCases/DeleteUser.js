const { UserNotFoundError } = require('../../domain/UserErrors');

class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new UserNotFoundError();
  }
}

module.exports = DeleteUser;
