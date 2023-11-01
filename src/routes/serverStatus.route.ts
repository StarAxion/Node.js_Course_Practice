import { Router } from 'express';

import serverStatusCheck from '../controllers/serverStatus.controller';

const router = Router();

/**
 * @swagger
 * /health-check:
 *   get:
 *     tags:
 *       - Health check
 *     description: Check health status of the server
 *     responses:
 *       200:
 *         description: The server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */

router.get('/health-check', serverStatusCheck);

export default router;
