const { identity } = require('./identity');

function pipe(...fns) {
  if (fns.length === 0) {
    return identity;
  }
  return function pipefn(...args) {
    const value = fns[0](...args);
    return fns.slice(1).reduce((p, fn) => fn(p), value);
  };
}

module.exports = { pipe };
