const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { MULT_TAG } = require('./tags');

function multOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[MULT_TAG])) {
      return a.constructor[MULT_TAG](a, b);
    }
  }
  if (isObject(b)) {
    if (isFunction(b.constructor[MULT_TAG])) {
      return b.constructor[MULT_TAG](a, b);
    }
  }
  return Number(a) * Number(b);
}

module.exports = { multOp };
