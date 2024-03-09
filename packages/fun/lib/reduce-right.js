const { curry3 } = require('./curry3');
const { forEachRight } = require('./for-each-right');

function reduceRight(x, fn, intialValue) {
  let result = intialValue;
  forEachRight(x, (n, i, arr) => {
    result = fn(result, n, i, arr);
  });
  return result;
}

module.exports = { reduceRight: curry3(reduceRight) };
