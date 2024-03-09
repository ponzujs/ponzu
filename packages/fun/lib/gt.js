const { curry2 } = require('./curry2');

function gt(a, b) {
  return a > b;
}

module.exports = { gt: curry2(gt) };
