const cluster = require('node:cluster');
const { v4 } = require('@ponzujs/core');

class WorkerMemory {
  constructor() {
    this.callbacks = {};
    process.on('message', (data) => {
      if (data.isSharedMemoryMessage) {
        this.receiveMessage(data);
      }
    });
  }

  receiveMessage(message) {
    const cb = this.callbacks[message.uuid];
    if (cb !== undefined) {
      if (typeof cb === 'function') {
        cb(message.data?.value);
      }
      delete this.callbacks[message.uuid];
    }
  }

  sendMessage(data, cb) {
    const message = {
      isSharedMemoryMessage: true,
      sender: cluster.Worker.id,
      uuid: v4(),
      data,
    };
    if (cb) {
      this.callbacks[message.uuid] = cb;
    }
    process.send(message);
  }

  executeMethod(method, settings = {}) {
    return new Promise((resolve) => {
      this.sendMessage({ method, ...settings }, (value) => resolve(value));
    });
  }

  get(settings) {
    return this.executeMethod('get', settings);
  }

  set(settings) {
    return this.executeMethod('set', settings);
  }

  remove(settings) {
    return this.executeMethod('remove', settings);
  }

  clear(settings) {
    return this.executeMethod('clear', settings);
  }

  setChild(settings) {
    return this.executeMethod('setChild', settings);
  }

  getChild(settings) {
    return this.executeMethod('getChild', settings);
  }

  removeChild(settings) {
    return this.executeMethod('removeChild', settings);
  }

  clearChilds(settings) {
    return this.executeMethod('clearChilds', settings);
  }

  addData(settings) {
    return this.executeMethod('addData', settings);
  }

  removeData(settings) {
    return this.executeMethod('removeData', settings);
  }

  clearData(settings) {
    return this.executeMethod('clearData', settings);
  }

  getFromData(settings) {
    return this.executeMethod('getFromData', settings);
  }

  getFromDataByIndex(settings) {
    return this.executeMethod('getFromDataByIndex', settings);
  }

  putIntoData(settings) {
    return this.executeMethod('putIntoData', settings);
  }

  removeFromData(settings) {
    return this.executeMethod('removeFromData', settings);
  }
}

module.exports = { WorkerMemory };
