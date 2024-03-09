const { isArray } = require('./is-array');
const { isArrayLike } = require('./is-array-like');

function newArrayLike(x, arr) {
  if (!isArray(x) && isArrayLike(x) && x.constructor) {
    return new x.constructor(arr);
  }
  return arr;
}

module.exports = { newArrayLike };
