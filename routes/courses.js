const express = require('express');

const router = express.Router();

const courses = require('../data/courses');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - id
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the course.
 *         title:
 *           type: string
 *           description: Title of the course.
 *       example:
 *         id: ghi-789
 *         title: Node.js
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     description: Get the list of courses.
 *     responses:
 *       200:
 *         description: OK - Array of courses in JSON format.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       404:
 *         description: Not Found - Courses not found.
 *       500:
 *         description: Internal Server Error - An unexpected error occurred on the server.
 */

router.get('/', (req, res) => {
  res.json(courses);
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     description: Get course by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the course.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK - Course data in JSON format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Not Found - Course not found.
 *       500:
 *         description: Internal Server Error - An unexpected error occurred on the server.
 */

router.get('/:id', (req, res, next) => {
  const courseId = req.params.id;
  const course = courses.find(({ id }) => id === courseId);
  if (course) {
    res.json(course);
  } else {
    const error = new Error('Course not found');
    error.status = 404;
    next(error);
  }
});

module.exports = router;
