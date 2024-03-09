const { divOp } = require('./div-op');
const { curry2 } = require('./curry2');

function div(...args) {
  let current = args[0];
  for (let i = 1; i < args.length; i += 1) {
    current = divOp(current, args[i]);
  }
  return current;
}

module.exports = { div: curry2(div) };
