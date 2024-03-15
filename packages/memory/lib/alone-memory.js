const { Cache } = require('@ponzujs/core');

class AloneMemory {
  constructor() {
    this.memory = { data: {} };
  }

  get({ slotName }) {
    return this.memory[slotName];
  }

  set({ slotName, slot }) {
    this.memory[slotName] = slot;
  }

  remove({ slotName }) {
    delete this.memory[slotName];
  }

  clear() {
    this.memory = { data: {} };
  }

  setChild({ slotName, childName, value }) {
    if (!this.memory[slotName]) {
      this.memory[slotName] = {};
    }
    this.memory[slotName][childName] = value;
  }

  getChild({ slotName, childName }) {
    const slot = this.memory[slotName];
    return slot ? slot[childName] : undefined;
  }

  removeChild({ slotName, childName }) {
    if (this.memory[slotName]) {
      delete this.memory[slotName][childName];
    }
  }

  clearChilds({ slotName }) {
    this.memory[slotName] = {};
  }

  addData(settings) {
    if (!this.memory.data[settings.collectionName]) {
      this.memory.data[settings.collectionName] = new Cache(settings);
    }
  }

  removeData({ collectionName }) {
    if (this.memory.data[collectionName]) {
      delete this.memory.data[collectionName];
    }
  }

  clearData({ collectionName }) {
    if (this.memory.data[collectionName]) {
      this.memory.data[collectionName].clear();
    }
  }

  getFromData({ collectionName, id }) {
    return this.memory.data[collectionName]?.get(id);
  }

  getFromDataByIndex({ collectionName, field, value }) {
    return this.memory.data[collectionName]?.getByIndex(field, value);
  }

  putIntoData({ collectionName, item }) {
    if (!this.memory.data[collectionName]) {
      this.memory.data[collectionName] = new Cache();
    }
    this.memory.data[collectionName].put(item);
  }

  removeFromData({ collectionName, id }) {
    this.memory.data[collectionName]?.remove(id);
  }
}

module.exports = { AloneMemory };
