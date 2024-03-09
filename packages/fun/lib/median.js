const { map } = require('./map');
const { identity } = require('./identity');

function median(...args) {
  if (args.length === 0) {
    return NaN;
  }
  if (args.length > 1) {
    return median(args);
  }
  const arr = map(args[0], identity).sort((a, b) => a - b);
  const mod2 = arr.length % 2;
  const idx = (arr.length - 2 + mod2) / 2;
  return mod2 === 1 ? arr[idx] : (arr[idx] + arr[idx + 1]) / 2;
}

module.exports = { median };
