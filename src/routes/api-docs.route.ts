import { Router } from 'express';

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

setupSwagger(router, '/api-docs');

export default router;
