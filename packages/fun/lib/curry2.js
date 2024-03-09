const { isPlaceholder } = require('./is-placeholder');

function curry2(fn) {
  return function f2(...args) {
    if (args.length === 0) {
      return f2;
    }
    if (args.length === 1) {
      return isPlaceholder(args[0])
        ? f2
        : (b, ...cargs) => fn(args[0], b, ...cargs);
    }
    if (isPlaceholder(args[0])) {
      return isPlaceholder(args[1])
        ? f2
        : (a, ...cargs) => fn(a, args[1], ...cargs);
    }
    return isPlaceholder(args[1])
      ? (b, ...cargs) => fn(args[0], b, ...cargs)
      : fn(...args);
  };
}

module.exports = { curry2 };
