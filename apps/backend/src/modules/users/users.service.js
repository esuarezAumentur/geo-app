const User = require('../../models/User');
const HTTP_STATUS = require('../../constants/httpStatus');
const MESSAGES = require('../../constants/messages');

async function listUsers() {
  return User.find({}, '-passwordHash').sort({ createdAt: -1 });
}

async function getUserById(id) {
  const user = await User.findById(id, '-passwordHash');
  if (!user) {
    const err = new Error(MESSAGES.USER_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return user;
}

async function createUser({ email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error(MESSAGES.AUTH_EMAIL_TAKEN);
    err.status = HTTP_STATUS.CONFLICT;
    throw err;
  }
  const passwordHash = await User.hashPassword(password);
  return User.create({ email, passwordHash, role });
}

async function updateUser(id, data) {
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-passwordHash');
  if (!user) {
    const err = new Error(MESSAGES.USER_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return user;
}

async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error(MESSAGES.USER_NOT_FOUND);
    err.status = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
