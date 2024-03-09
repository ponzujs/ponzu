const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { POW_TAG } = require('./tags');

function powOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[POW_TAG])) {
      return a.constructor[POW_TAG](a, b);
    }
  }
  if (isObject(b)) {
    if (isFunction(b.constructor[POW_TAG])) {
      return b.constructor[POW_TAG](a, b);
    }
  }
  return Number(a) ** Number(b);
}

module.exports = { powOp };
