const baseProvider = require('./base-provider');
const cachedEnvelope = require('./cached-envelope');
const collection = require('./collection');
const databaseManager = require('./database-manager');
const database = require('./database');
const fsProvider = require('./fs-provider');
const loggedEnvelope = require('./logged-envelope');
const mongodbProvider = require('./mongodb-provider');
const sharedEnvelope = require('./shared-envelope');

module.exports = {
  ...baseProvider,
  ...cachedEnvelope,
  ...collection,
  ...databaseManager,
  ...database,
  ...fsProvider,
  ...loggedEnvelope,
  ...mongodbProvider,
  ...sharedEnvelope,
};
