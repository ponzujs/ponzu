const { curry2 } = require('./curry2');
const { isArrayLike } = require('./is-array-like');
const { isString } = require('./is-string');
const { isObject } = require('./is-object');
const { isIterable } = require('./is-iterable');
const { newArrayLike } = require('./new-array-like');

function mapSrc(x, fn) {
  if (x === undefined || x === null) {
    return x;
  }
  if (isArrayLike(x)) {
    const result = [];
    for (let i = 0; i < x.length; i += 1) {
      result.push(fn(x[i], i, x));
    }
    return newArrayLike(x, result);
  }
  if (isString(x)) {
    const result = [];
    for (let i = 0; i < x.length; i += 1) {
      result.push(fn(x[i], i, x));
    }
    return result.join('');
  }
  if (isIterable(x)) {
    let index = 0;
    const result = [];
    const iterator = x[Symbol.iterator]();
    let current;
    do {
      current = iterator.next();
      if (!current.done) {
        result.push(fn(current.value, current.index || index, x));
        index += 1;
      }
    } while (!current.done);
    return newArrayLike(x, result);
  }
  if (isObject(x)) {
    const result = {};
    const keys = Object.keys(x);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result[key] = fn(x[key], key, x);
    }
    return result;
  }
  return fn(x, 0, x);
}

module.exports = { mapSrc: curry2(mapSrc) };
