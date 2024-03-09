const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { SUBTRACT_TAG, NEGATE_TAG } = require('./tags');
const { add } = require('./add');
const { negate } = require('./negate');

function subtractOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[SUBTRACT_TAG])) {
      return a.constructor[SUBTRACT_TAG](a, b);
    }
  }
  if (isObject(b)) {
    if (isFunction(b.constructor[SUBTRACT_TAG])) {
      return b.constructor[SUBTRACT_TAG](a, b);
    }
    if (isFunction(b.constructor[NEGATE_TAG])) {
      return add(a, negate(b));
    }
  }
  if (typeof a === typeof b && !(a instanceof Date)) {
    return a - b;
  }
  return Number(a) - Number(b);
}

module.exports = { subtractOp };
