const { curry2 } = require('./curry2');
const { forWhile } = require('./for-while');

function every(x, fn) {
  if (x === undefined || x === null) {
    return false;
  }
  let result = true;
  forWhile(x, (value, index, iter) => {
    if (fn(value, index, iter) === false) {
      result = false;
      return false;
    }
    return true;
  });
  return result;
}

module.exports = { every: curry2(every) };
