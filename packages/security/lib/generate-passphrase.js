const crypto = require('node:crypto');

const generatePassphrase = () => crypto.randomBytes(20).toString('hex');

module.exports = {
  generatePassphrase,
};
