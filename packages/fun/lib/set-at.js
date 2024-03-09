const { clone } = require('@ponzujs/core');
const { curry2 } = require('./curry2');
const { atIndex } = require('./at-index');
const { isArrayLike } = require('./is-array-like');
const { isIterable } = require('./is-iterable');
const { isObject } = require('./is-object');
const { isString } = require('./is-string');
const { len } = require('./len');
const { newArrayLike } = require('./new-array-like');

function setAt(x, index, value) {
  if (x === undefined) {
    throw new Error(`Cannot perform setAt on undefined`);
  }
  if (x === null) {
    throw new Error(`Cannot perform setAt on null`);
  }
  if (isString(x)) {
    const position = atIndex(x.length, index);
    const list = x.split('');
    if (value === undefined || value === null) {
      list.splice(position, 1);
      return list.join('');
    }
    list[position] = value;
    return list.join('');
  }
  if (isArrayLike(x)) {
    const position = atIndex(len(x), index);
    const result = clone(x);
    if (position !== -1) {
      result[position] = value;
    }
    return newArrayLike(x, result);
  }
  if (isIterable(x)) {
    const result = [];
    const iterator = x[Symbol.iterator]();
    let current;
    do {
      current = iterator.next();
      if (!current.done) {
        result.push(current.value);
      }
    } while (!current.done);
    const position = atIndex(len(result), index);
    result[position] = value;
    return newArrayLike(x, result);
  }
  if (isObject(x)) {
    const result = clone(x);
    if (value === undefined) {
      delete result[index];
    } else {
      result[index] = value;
    }
    return result;
  }
  throw new Error(`Cannot perform setAt on input`);
}

module.exports = { setAt: curry2(setAt) };
