const cluster = require('node:cluster');
const { ioc } = require('@ponzujs/core');
const { PrimaryMemory } = require('./primary-memory');
const { WorkerMemory } = require('./worker-memory');

function getSharedMemory() {
  let sharedMemory = ioc.get('sharedMemory');
  if (!sharedMemory) {
    sharedMemory = cluster.isPrimary ? new PrimaryMemory() : new WorkerMemory();
    ioc.register('sharedMemory', sharedMemory);
  }
  return sharedMemory;
}

module.exports = {
  getSharedMemory,
};
