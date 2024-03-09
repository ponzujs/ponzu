function isIterable(x) {
  return x && !!x[Symbol.iterator];
}

module.exports = { isIterable };
