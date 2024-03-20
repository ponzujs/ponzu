const { CONFIG } = require('./constants');

const swaggerSpecs = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: CONFIG.SWAGGER_TITLE,
      version: CONFIG.SWAGGER_VERSION,
      description: CONFIG.SWAGGER_DESCRIPTION,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: {
      bearerAuth: [],
    },
    servers: CONFIG.SWAGGER_SERVERS || [
      {
        url: `http://localhost:${CONFIG.PORT}${CONFIG.API_ROOT}`,
      },
    ],
  },
  apis: ['./**/*.router.js', './**/*.swagger.js'],
};

module.exports = { swaggerSpecs };
