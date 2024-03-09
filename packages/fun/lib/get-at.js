const { curry2 } = require('./curry2');
const { atIndex } = require('./at-index');
const { isArrayLike } = require('./is-array-like');
const { isIterable } = require('./is-iterable');
const { map } = require('./map');
const { identity } = require('./identity');
const { isObject } = require('./is-object');
const { isString } = require('./is-string');
const { len } = require('./len');

function getAt(x, index) {
  if (x === undefined) {
    throw new Error(`Cannot perform getAt on undefined`);
  }
  if (x === null) {
    throw new Error(`Cannot perform getAt on null`);
  }
  if (isString(x) || isArrayLike(x)) {
    const position = atIndex(len(x), index);
    return x[position];
  }
  if (isIterable(x)) {
    const arr = map(x, identity);
    return getAt(arr, index);
  }
  if (isObject(x)) {
    return x[index];
  }
  throw new Error('Cannot perform getAt on input');
}

module.exports = { getAt: curry2(getAt) };
