const { asArrayLike } = require('./as-array-like');
const { curry2 } = require('./curry2');

function zip(srcA, srcB) {
  const a = asArrayLike(srcA);
  const b = asArrayLike(srcB);
  const len = Math.min(a.length, b.length);
  const result = [];
  for (let i = 0; i < len; i += 1) {
    result.push([a[i], b[i]]);
  }
  return result;
}

module.exports = { zip: curry2(zip) };
