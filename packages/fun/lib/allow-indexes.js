const { curry2 } = require('./curry2');
const { boolDict } = require('./bool-dict');
const { filter } = require('./filter');

function allowIndexes(x, arr) {
  const dict = boolDict(arr);
  return filter(x, (n, i) => dict[i]);
}

module.exports = { allowIndexes: curry2(allowIndexes) };
