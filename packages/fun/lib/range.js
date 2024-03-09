const { Iterable } = require('./iterable');

class RangeIterable extends Iterable {
  constructor(from, to, step = 1) {
    super();
    if (to === undefined) {
      this.from = 0;
      this.to = from;
    } else {
      this.from = from;
      this.to = to;
    }
    this.step = step;
  }

  getInitialIndex() {
    return this.from;
  }

  getLastIndex() {
    return this.to;
  }

  getNextIndex(currentIndex) {
    return currentIndex + this.step;
  }
}

function range(from, to, step) {
  return new RangeIterable(from, to, step);
}

module.exports = { range };
