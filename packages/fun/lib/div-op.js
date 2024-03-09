const { isFunction } = require('@ponzujs/core');
const { isObject } = require('./is-object');
const { DIV_TAG } = require('./tags');

function divOp(a, b) {
  if (isObject(a)) {
    if (isFunction(a.constructor[DIV_TAG])) {
      return a.constructor[DIV_TAG](a, b);
    }
  }
  if (isObject(b)) {
    if (isFunction(b.constructor[DIV_TAG])) {
      return b.constructor[DIV_TAG](a, b);
    }
  }
  return Number(a) / Number(b);
}

module.exports = { divOp };
