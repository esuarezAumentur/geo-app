const { UserNotFoundError } = require('../../domain/UserErrors');

class GetUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}

module.exports = GetUser;
