const { curry2 } = require('./curry2');
const { powOp } = require('./pow-op');

function pow(a, b) {
  return powOp(a, b);
}

module.exports = { pow: curry2(pow) };
