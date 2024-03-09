const { curry2 } = require('./curry2');
const { forEach } = require('./for-each');

function map(x, fn) {
  const result = [];
  forEach(x, (n, i, arr) => result.push(fn(n, i, arr)));
  return result;
}

module.exports = { map: curry2(map) };
