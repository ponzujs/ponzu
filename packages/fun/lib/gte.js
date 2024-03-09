const { curry2 } = require('./curry2');

function gte(a, b) {
  return a >= b;
}

module.exports = { gte: curry2(gte) };
