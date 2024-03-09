class ShelveManager {
  constructor() {
    this.shelves = new Map();
  }

  getShelve(name) {
    if (!this.shelves.has(name)) {
      this.shelves.set(name, new Map());
    }
    return this.shelves.get(name);
  }

  getFromShelve(shelveName, name) {
    const shelve = this.getShelve(shelveName);
    return shelve.get(name);
  }

  setIntoShelve(shelveName, name, value) {
    const shelve = this.getShelve(shelveName);
    shelve.set(name, value);
  }
}

module.exports = { ShelveManager };
