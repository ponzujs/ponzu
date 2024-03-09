class Iterable {
  // eslint-disable-next-line class-methods-use-this
  getCurrentValue(currentIndex) {
    return currentIndex;
  }

  [Symbol.iterator]() {
    const result = {
      parent: this,
      currentIndex: this.getInitialIndex(),
      lastIndex: this.getLastIndex(),
      next() {
        if (this.currentIndex >= this.lastIndex) {
          return { done: true };
        }
        const ret = {
          done: false,
          value: this.parent.getCurrentValue(this.currentIndex),
          index: this.currentIndex,
        };
        this.currentIndex = this.parent.getNextIndex(this.currentIndex);
        return ret;
      },
    };
    return result;
  }
}

module.exports = { Iterable };
