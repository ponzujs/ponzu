const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { swaggerSpecs } = require('./swagger-specs');

const { CONFIG } = require('./constants');

function mountSwagger(app, settings = {}) {
  const specs = swaggerJsdoc(settings.swaggerSpecs || swaggerSpecs);
  const docsEndpoint = settings.docsEndpoint || CONFIG.SWAGGER_ENDPOINT;
  const jsonName = settings.jsonName || CONFIG.SWAGGER_JSON_NAME;
  const mountJson = (settings.mountJson ?? CONFIG.SWAGGER_MOUNT_JSON) !== false;
  if (mountJson) {
    app.get(`${docsEndpoint}/${jsonName}`, (_req, res) => res.json(specs));
  }
  app.use(docsEndpoint, swaggerUi.serve);
  app.use(docsEndpoint, swaggerUi.setup(specs, { explorer: true }));
}

module.exports = { mountSwagger };
