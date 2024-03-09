const { curry2 } = require('./curry2');
const { forEach } = require('./for-each');

function filter(x, fn) {
  const result = [];
  forEach(x, (n, i, arr) => {
    if (fn(n, i, arr)) {
      result.push(n);
    }
  });
  return result;
}

module.exports = { filter: curry2(filter) };
