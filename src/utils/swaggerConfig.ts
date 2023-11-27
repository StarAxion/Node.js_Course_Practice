import { Router } from 'express';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import { SERVER_URL as url } from './constants';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for Node.js Course Practice'
    },
    servers: [{ url }]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (router: Router, path: string): void => {
  router.use(path, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};

export default setupSwagger;
