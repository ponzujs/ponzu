const { PLACEHOLDER_TAG } = require('./tags');

function isPlaceholder(obj) {
  return !!(obj && obj[PLACEHOLDER_TAG]);
}

module.exports = { isPlaceholder };
