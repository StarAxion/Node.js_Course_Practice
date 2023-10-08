import { Router } from 'express';

import setupSwagger from '../utils/swagger';

const router = Router();

/**
 * @swagger
 * /api-docs:
 *   get:
 *     tags:
 *       - API documentation
 *     description: Swagger API documentation.
 *     responses:
 *       200:
 *         description: OK - Successfully accessed Swagger UI.
 */

setupSwagger(router, '/api-docs');

export default router;
