const { isArrayLike } = require('./is-array-like');
const { isObject } = require('./is-object');
const { isIterable } = require('./is-iterable');

function len(x) {
  if (!x) {
    return 0;
  }
  if (x === true) {
    return 1;
  }
  if (isArrayLike(x)) {
    return x.length;
  }
  if (isObject(x) && !isIterable(x)) {
    return Object.keys(x).length;
  }
  if (x.length) {
    return x.length;
  }
  if (x.size) {
    return x.size;
  }
  if (x.count) {
    return x.count;
  }
  if (isIterable(x)) {
    let index = 0;
    const iterator = x[Symbol.iterator]();
    let current;
    do {
      current = iterator.next();
      if (!current.done) {
        index += 1;
      }
    } while (!current.done);
    return index;
  }
  return x.toString().length;
}

module.exports = { len };
