const bcrypt = require('bcryptjs');
const { EmailTakenError } = require('../../domain/AuthErrors');

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password, role }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new EmailTakenError();

    const passwordHash = await bcrypt.hash(password, 12);
    return this.userRepository.create({ email, passwordHash, role: role || 'viewer' });
  }
}

module.exports = RegisterUser;
