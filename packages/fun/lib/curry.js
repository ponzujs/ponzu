const { curryN } = require('./curry-n');

function curry(fn) {
  return curryN(fn.length, fn);
}

module.exports = { curry };
