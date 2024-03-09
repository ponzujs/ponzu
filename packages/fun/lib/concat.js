const { curry2 } = require('./curry2');
const { forEach } = require('./for-each');

function concat(a, b) {
  const result = [];
  forEach(a, (n) => result.push(n));
  forEach(b, (n) => result.push(n));
  return result;
}

module.exports = { concat: curry2(concat) };
