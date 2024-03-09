const { curry2 } = require('./curry2');
const { orOp } = require('./or-op');

function or(...args) {
  let result = false;
  for (let i = 0; i < args.length; i += 1) {
    result = orOp(result, args[i]);
    if (result) {
      return true;
    }
  }
  return false;
}

module.exports = { or: curry2(or) };
