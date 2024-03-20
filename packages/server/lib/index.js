const clusterServer = require('./cluster-server');
const contants = require('./constants');
const createApp = require('./create-app');
const errorResponse = require('./error-response');
const mountSwagger = require('./mount-swagger');
const server = require('./server');
const swaggerSpecs = require('./swagger-specs');

module.exports = {
  ...clusterServer,
  ...contants,
  ...createApp,
  ...errorResponse,
  ...mountSwagger,
  ...server,
  ...swaggerSpecs,
};
