const { cpus } = require('node:os');

const HTTP_STATUS = {
  OK: 200,
  ACCEPTED: 202,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

const MESSAGES = {
  NOT_FOUND: 'Nothing to see here',
  NO_ACCESS: 'No access',
};

const CONFIG = {
  API_ROOT: process.env.API_ROOT || '/api',
  PORT: process.env.PORT || 3000,
  VAULT_DIR: process.env.VAULT_DIR || './data/vault',
  NUM_CLUSTERS: process.env.NUM_CLUSTERS || cpus().length,
  SWAGGER_TITLE: process.env.SWAGGER_TITLE || 'API',
  SWAGGER_VERSION: process.env.SWAGGER_VERSION || '1.0.0',
  SWAGGER_DESCRIPTION: process.env.SWAGGER_DESCRIPTION || 'API',
  SWAGGER_ENDPOINT: process.env.SWAGGER_ENDPOINT || '/docs',
  SWAGGER_JSON_NAME: 'openapi.json',
  SWAGGER_MOUNT_JSON: true,
};

module.exports = { HTTP_STATUS, MESSAGES, CONFIG };
