const { isPlaceholder } = require('./is-placeholder');
const { curry2 } = require('./curry2');
const { curry3 } = require('./curry3');

function applyFn(fn) {
  return function applyFnRet(...args) {
    return fn.apply(this, args);
  };
}

function curryN(length, fn, received = []) {
  if (length === 1) {
    return fn;
  }
  if (length === 2) {
    return curry2(fn);
  }
  if (length === 3) {
    return curry3(fn);
  }
  return function curryNret(...args) {
    const combined = [];
    let argsIndex = 0;
    let left = length;
    let combinedIndex = 0;
    while (combinedIndex < received.length || argsIndex < args.length) {
      if (
        combinedIndex < received.length &&
        (!isPlaceholder(received[combinedIndex]) || argsIndex >= args.length)
      ) {
        combined[combinedIndex] = received[combinedIndex];
      } else {
        combined[combinedIndex] = args[argsIndex];
        argsIndex += 1;
      }
      if (!isPlaceholder(combined[combinedIndex])) {
        left -= 1;
      }
      combinedIndex += 1;
    }
    return left <= 0
      ? fn.apply(this, combined)
      : applyFn(curryN(length, fn, combined));
  };
}

module.exports = { curryN: curry2(curryN) };
