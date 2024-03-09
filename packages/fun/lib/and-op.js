const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { AND_TAG } = require('./tags');

function andOp(a, b) {
  if (isObject(a) && isFunction(a.constructor[AND_TAG])) {
    return a.constructor[AND_TAG](a, b);
  }
  if (isObject(b) && isFunction(b.constructor[AND_TAG])) {
    return b.constructor[AND_TAG](a, b);
  }
  return a && b;
}

module.exports = { andOp };
