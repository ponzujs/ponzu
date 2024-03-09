const { curry2 } = require('./curry2');
const { forEachRight } = require('./for-each-right');

function mapRight(x, fn) {
  const result = [];
  forEachRight(x, (n, i, arr) => result.push(fn(n, i, arr)));
  return result;
}

module.exports = { mapRight: curry2(mapRight) };
