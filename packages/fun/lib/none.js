const { curry2 } = require('./curry2');
const { forWhile } = require('./for-while');

function none(x, fn) {
  if (x === undefined || x === null) {
    return true;
  }
  let result = true;
  forWhile(x, (value, index, iter) => {
    if (fn(value, index, iter) === true) {
      result = false;
      return false;
    }
    return true;
  });
  return result;
}

module.exports = { none: curry2(none) };
