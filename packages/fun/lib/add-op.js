const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { merge } = require('./merge');
const { ADD_TAG } = require('./tags');

function addOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[ADD_TAG])) {
      return a.constructor[ADD_TAG](a, b);
    }
    return merge(a, b);
  }
  if (typeof a === typeof b && !(a instanceof Date)) {
    return a + b;
  }
  return Number(a) + Number(b);
}

module.exports = { addOp };
