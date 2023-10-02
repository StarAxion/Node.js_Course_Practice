const express = require('express');

const router = express.Router();

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

router.get('/health-check', (req, res) => {
  res.json({ status: 'The server is running' });
});

module.exports = router;
