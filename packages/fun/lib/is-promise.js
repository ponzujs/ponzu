const { isFunction } = require('@ponzujs/core');

function isPromise(p) {
  return p && isFunction(p.then);
}

module.exports = { isPromise };
