const bcrypt = require('bcrypt');

function hashPassword(password, saltRounds = 10) {
  return bcrypt.hash(password, saltRounds);
}

function checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function isHash(password) {
  if (!password) {
    return false;
  }
  return password.length === 60 && password.startsWith('$2b$');
}

module.exports = {
  hashPassword,
  checkPassword,
  isHash,
};
