const cluster = require('node:cluster');
const { AloneMemory } = require('./alone-memory');

class PrimaryMemory extends AloneMemory {
  constructor() {
    super();
    cluster.on('online', (worker) => {
      worker.on('message', (message) => {
        if (message.isSharedMemoryMessage) {
          this.receiveMessage(message, worker);
        }
      });
    });
  }

  executeMethod(message) {
    const { data } = message;
    if (this[data.method]) {
      return this[data.method](data);
    }
    return undefined;
  }

  receiveMessage(message, worker) {
    const value = this.executeMethod(message);
    const answer = {
      isSharedMemoryMessage: true,
      sender: process.pid,
      uuid: message.uuid,
      data: { value },
    };
    worker.send(answer);
  }
}

module.exports = { PrimaryMemory };
