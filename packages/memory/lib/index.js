const aloneMemory = require('./alone-memory');
const primaryMemory = require('./primary-memory');
const sharedMemory = require('./shared-memory');
const workerMemory = require('./worker-memory');

module.exports = {
  ...aloneMemory,
  ...primaryMemory,
  ...sharedMemory,
  ...workerMemory,
};
