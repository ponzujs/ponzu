const { forEach } = require('./for-each');

function mean(...args) {
  if (!args || args.length === 0) {
    return NaN;
  }
  if (args.length > 1) {
    return mean(args);
  }
  let total = 0;
  let count = 0;
  forEach(args[0], (x) => {
    total += x;
    count += 1;
  });
  if (count === 0) {
    return NaN;
  }
  return total / count;
}

module.exports = { mean };
