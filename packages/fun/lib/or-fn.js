const { isFunction } = require('@ponzujs/core');
const { curry2 } = require('./curry2');
const { orOp } = require('./or-op');

function orFn(...fns) {
  return function andFnRet(...args) {
    let result = false;
    for (let i = 0; i < fns.length; i += 1) {
      const fn = fns[i];
      const value = isFunction(fn) ? fn(...args) : fn;
      result = orOp(result, value);
      if (value) {
        return true;
      }
    }
    return false;
  };
}

module.exports = { orFn: curry2(orFn) };
