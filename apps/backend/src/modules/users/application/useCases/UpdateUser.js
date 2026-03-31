const { UserNotFoundError } = require('../../domain/UserErrors');

class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, data) {
    const user = await this.userRepository.update(id, data);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}

module.exports = UpdateUser;
