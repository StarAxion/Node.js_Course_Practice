const express = require('express');

const router = express.Router();

const { swaggerUI, swaggerSpec } = require('../utils/swagger');

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

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = router;
