const { curry2 } = require('./curry2');
const { isArrayLike } = require('./is-array-like');
const { isString } = require('./is-string');
const { isObject } = require('./is-object');
const { isIterable } = require('./is-iterable');

function forEachRight(x, fn) {
  if (x !== undefined && x !== null) {
    if (isArrayLike(x) || isString(x)) {
      for (let i = x.length - 1; i >= 0; i -= 1) {
        fn(x[i], i, x);
      }
    } else if (isIterable(x)) {
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
        fn(items[i], i, x);
      }
    } else if (isObject(x)) {
      const keys = Object.keys(x);
      for (let i = keys.length - 1; i >= 0; i -= 1) {
        const key = keys[i];
        fn(x[key], key, x);
      }
    } else {
      fn(x, 0, x);
    }
  }
}

module.exports = { forEachRight: curry2(forEachRight) };
