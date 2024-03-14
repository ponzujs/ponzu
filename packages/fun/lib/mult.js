const { multOp } = require('./mult-op');
const { curry2 } = require('./curry2');

function mult(...args) {
  let current = args[0];
  for (let i = 1; i < args.length; i += 1) {
    current = multOp(current, args[i]);
  }
  return current;
}

module.exports = { mult: curry2(mult) };
