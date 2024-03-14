const crypto = require('crypto');

const v4 = () => crypto.randomUUID();

module.exports = {
  v4,
};
