const { curry2 } = require('./curry2');
const { andOp } = require('./and-op');

function and(...args) {
  let result = true;
  for (let i = 0; i < args.length; i += 1) {
    result = andOp(result, args[i]);
    if (!result) {
      return false;
    }
  }
  return true;
}

module.exports = { and: curry2(and) };
