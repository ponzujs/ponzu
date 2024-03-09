const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { MOD_TAG } = require('./tags');

function modOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[MOD_TAG])) {
      return a.constructor[MOD_TAG](a, b);
    }
  }
  if (isObject(b)) {
    if (isFunction(b.constructor[MOD_TAG])) {
      return b.constructor[MOD_TAG](a, b);
    }
  }
  return Number(a) % Number(b);
}

module.exports = { modOp };
