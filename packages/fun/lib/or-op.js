const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { OR_TAG } = require('./tags');

function orOp(a, b) {
  if (isObject(a) && isFunction(a.constructor[OR_TAG])) {
    return a.constructor[OR_TAG](a, b);
  }
  if (isObject(b) && isFunction(b.constructor[OR_TAG])) {
    return b.constructor[OR_TAG](a, b);
  }
  return a || b;
}

module.exports = { orOp };
