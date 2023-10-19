import { Router, type Request, type Response } from 'express';

const router = Router();

/**
 * @swagger
 * /health-check:
 *   get:
 *     tags:
 *       - Health check
 *     description: Check health status of the server.
 *     responses:
 *       200:
 *         description: OK - The server is running.
 */

router.get('/health-check', (req: Request, res: Response): void => {
  res.json({ status: 'The server is running' });
});

export default router;
