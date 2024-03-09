const { curry2 } = require('./curry2');

function lt(a, b) {
  return a < b;
}

module.exports = { lt: curry2(lt) };
