const { curry2 } = require('./curry2');
const { isArrayLike } = require('./is-array-like');
const { isString } = require('./is-string');
const { isObject } = require('./is-object');
const { isIterable } = require('./is-iterable');
const { newArrayLike } = require('./new-array-like');

function mapRightSrc(x, fn) {
  if (x === undefined || x === null) {
    return x;
  }
  if (isArrayLike(x)) {
    const result = [];
    for (let i = x.length - 1; i >= 0; i -= 1) {
      result.push(fn(x[i], i, x));
    }
    return newArrayLike(x, result);
  }
  if (isString(x)) {
    const result = [];
    for (let i = x.length - 1; i >= 0; i -= 1) {
      result.push(fn(x[i], i, x));
    }
    return result.join('');
  }
  if (isIterable(x)) {
    const result = [];
    const iterator = x[Symbol.iterator]();
    let current;
    const items = [];
    do {
      current = iterator.next();
      if (!current.done) {
        items.push(current.value);
      }
    } while (!current.done);
    for (let i = items.length - 1; i >= 0; i -= 1) {
      result.push(fn(items[i], i, x));
    }
    return newArrayLike(x, result);
  }
  if (isObject(x)) {
    const result = {};
    const keys = Object.keys(x);
    for (let i = keys.length - 1; i >= 0; i -= 1) {
      const key = keys[i];
      result[key] = fn(x[key], key, x);
    }
    return result;
  }
  return fn(x, 0, x);
}

module.exports = { mapRightSrc: curry2(mapRightSrc) };
