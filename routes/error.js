const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /internal-server-error:
 *   get:
 *     tags:
 *       - Error handling
 *     description: Simulate an Internal Server Error.
 *     responses:
 *       500:
 *         description: Internal Server Error - An expected error occurred on the server.
 */

router.get('/internal-server-error', (req, res, next) => {
  try {
    throw new Error('Simulated Internal Server Error');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /not-found:
 *   get:
 *     tags:
 *       - Error handling
 *     description: Non-existent route.
 *     responses:
 *       404:
 *         description: Not Found - Page not found.
 */

router.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

module.exports = router;
