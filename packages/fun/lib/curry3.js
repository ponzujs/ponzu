const { isPlaceholder } = require('./is-placeholder');
const { curry2 } = require('./curry2');

function curry3(fn) {
  return function f3(...args) {
    if (args.length === 0) {
      return f3;
    }
    if (args.length === 1) {
      return isPlaceholder(args[0])
        ? f3
        : curry2((b, c, ...cargs) => fn(args[0], b, c, ...cargs));
    }
    if (args.length === 2) {
      if (isPlaceholder(args[0])) {
        return isPlaceholder(args[1])
          ? f3
          : curry2((a, c, ...cargs) => fn(a, args[1], c, ...cargs));
      }
      return isPlaceholder(args[1])
        ? curry2((b, c, ...cargs) => fn(args[0], b, c, ...cargs))
        : (c, ...cargs) => fn(args[0], args[1], c, ...cargs);
    }
    if (isPlaceholder(args[0])) {
      if (isPlaceholder(args[1])) {
        return isPlaceholder(args[2])
          ? f3
          : curry2((a, b, ...cargs) => fn(a, b, args[2], ...cargs));
      }
      return isPlaceholder(args[2])
        ? curry2((a, c, ...cargs) => fn(a, args[1], c, ...cargs))
        : (a, ...cargs) => fn(a, args[1], args[2], ...cargs);
    }
    if (isPlaceholder(args[1])) {
      return isPlaceholder(args[2])
        ? curry2((b, c, ...cargs) => fn(args[0], b, c, ...cargs))
        : (b, ...cargs) => fn(args[0], b, args[2], ...cargs);
    }
    return isPlaceholder(args[2])
      ? (c, ...cargs) => fn(args[0], args[1], c, ...cargs)
      : fn(...args);
  };
}

module.exports = { curry3 };
