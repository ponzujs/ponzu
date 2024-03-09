const { NEGATE_TAG } = require('./tags');

function negate(x) {
  if (x && x.constructor && x.constructor[NEGATE_TAG]) {
    return x.constructor[NEGATE_TAG](x);
  }
  return -x;
}

module.exports = { negate };
