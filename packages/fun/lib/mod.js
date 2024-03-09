const { modOp } = require('./mod-op');
const { curry2 } = require('./curry2');

function mod(...args) {
  let current = args[0];
  for (let i = 1; i < args.length; i += 1) {
    current = modOp(current, args[i]);
  }
  return current;
}

module.exports = { mod: curry2(mod) };
