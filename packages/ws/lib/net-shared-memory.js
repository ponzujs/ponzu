const cluster = require('node:cluster');
const { WorkerMemory } = require('@ponzujs/memory');
const { NetPrimaryMemory } = require('./net-primary-memory');

async function getNetSharedMemory(settings = {}) {
  if (cluster.isPrimary) {
    const result = new NetPrimaryMemory(settings);
    await result.start();
    return result;
  }
  return new WorkerMemory();
}

module.exports = {
  getNetSharedMemory,
};
