const { curry2 } = require('./curry2');
const { asArrayLike } = require('./as-array-like');

function zipObj(a, b) {
  const keys = asArrayLike(a);
  const values = asArrayLike(b);
  const len = Math.min(keys.length, values.length);
  const result = {};
  for (let i = 0; i < len; i += 1) {
    result[keys[i]] = values[i];
  }
  return result;
}

module.exports = { zipObj: curry2(zipObj) };
