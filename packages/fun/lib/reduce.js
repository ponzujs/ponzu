const { curry3 } = require('./curry3');
const { forEach } = require('./for-each');

function reduce(x, fn, intialValue) {
  let result = intialValue;
  forEach(x, (n, i, arr) => {
    result = fn(result, n, i, arr);
  });
  return result;
}

module.exports = { reduce: curry3(reduce) };
