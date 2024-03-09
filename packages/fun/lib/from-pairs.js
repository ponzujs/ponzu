const { reduce } = require('./reduce');

function fromPairs(pairs) {
  return reduce(
    pairs,
    (p, c) => {
      const result = p;
      [, result[c[0]]] = c;
      return result;
    },
    {}
  );
}

module.exports = { fromPairs };
