const { subtractOp } = require('./subtract-op');
const { curry2 } = require('./curry2');

function subtract(...args) {
  let current = args[0];
  for (let i = 1; i < args.length; i += 1) {
    current = subtractOp(current, args[i]);
  }
  return current;
}

module.exports = { subtract: curry2(subtract) };
