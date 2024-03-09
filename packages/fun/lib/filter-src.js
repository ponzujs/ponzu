const { curry2 } = require('./curry2');
const { isArrayLike } = require('./is-array-like');
const { isString } = require('./is-string');
const { isObject } = require('./is-object');
const { isIterable } = require('./is-iterable');
const { newArrayLike } = require('./new-array-like');

function filterSrc(x, fn) {
  if (x === undefined || x === null) {
    return x;
  }
  if (isArrayLike(x)) {
    const result = [];
    for (let i = 0; i < x.length; i += 1) {
      if (fn(x[i], i, x)) {
        result.push(x[i]);
      }
    }
    return newArrayLike(x, result);
  }
  if (isString(x)) {
    const result = [];
    for (let i = 0; i < x.length; i += 1) {
      if (fn(x[i], i, x)) {
        result.push(x[i]);
      }
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
      if (!current.done && fn(current.value, current.index || index, x)) {
        result.push(current.value);
      }
      index += 1;
    } while (!current.done);
    return newArrayLike(x, result);
  }
  if (isObject(x)) {
    const result = {};
    const keys = Object.keys(x);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (fn(x[key], key, x)) {
        result[key] = x[key];
      }
    }
    return result;
  }
  return fn(x, 0, x) ? x : undefined;
}

module.exports = { filterSrc: curry2(filterSrc) };
