import { Router } from 'express';

import { routes } from '../utils/constants';
import setupSwagger from '../utils/swaggerConfig';

const router = Router();

/**
 * @swagger
 * /api-docs:
 *   get:
 *     tags:
 *       - API documentation
 *     description: Swagger API documentation
 *     responses:
 *       200:
 *         description: Successfully accessed Swagger UI
 */

setupSwagger(router, routes.apiDocs);

export default router;
