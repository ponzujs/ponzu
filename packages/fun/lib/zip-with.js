const { asArrayLike } = require('./as-array-like');
const { curry3 } = require('./curry3');

function zipWith(srcA, srcB, fn) {
  const a = asArrayLike(srcA);
  const b = asArrayLike(srcB);
  const len = Math.min(a.length, b.length);
  const result = [];
  for (let i = 0; i < len; i += 1) {
    result.push(fn(a[i], b[i]));
  }
  return result;
}

module.exports = { zipWith: curry3(zipWith) };
