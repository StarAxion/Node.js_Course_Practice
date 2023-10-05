const swaggerUI = require('swagger-ui-express');

const swaggerJSDoc = require('swagger-jsdoc');

const { SERVER_URL: url } = require('../utils/constants');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for Node.js Course Practice',
    },
    servers: [
      { url }
    ]
  },
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUI, swaggerSpec };
