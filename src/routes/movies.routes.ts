import { Router } from 'express';

import { routes } from '../utils/constants';
import MoviesController from '../controllers/movies.controller';

const router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *       - Movies
 *     description: Get list of movies
 *     responses:
 *       200:
 *         description: Array of movies in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResponseMovie'
 *       404:
 *         description: Movies not found
 *   post:
 *     tags:
 *       - Movies
 *     description: Create new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestMovie'
 *     responses:
 *       201:
 *         description: Movie created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMovie'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Movie already exists
 */

router.get(routes.root, MoviesController.getAllMovies);
router.post(routes.root, MoviesController.createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     description: Get movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie
 *         schema:
 *           type: string
 *         example: "123abc"
 *     responses:
 *       200:
 *         description: Movie data in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMovie'
 *       404:
 *         description: Movie not found
 *   put:
 *     tags:
 *       - Movies
 *     description: Update movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie
 *         schema:
 *           type: string
 *         example: "123abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestMovie'
 *     responses:
 *       200:
 *         description: Movie updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMovie'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie not found
 *       409:
 *         description: Movie already exists
 *   delete:
 *     tags:
 *       - Movies
 *     description: Delete movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the movie
 *         schema:
 *           type: string
 *         example: "123abc"
 *     responses:
 *       204:
 *         description: Movie deleted
 *       404:
 *         description: Movie not found
 */

router.get(routes.idParams, MoviesController.getMovieById);
router.put(routes.idParams, MoviesController.updateMovie);
router.delete(routes.idParams, MoviesController.deleteMovie);

/**
 * @swagger
 * /api/movies/genre/{genreName}:
 *   get:
 *     tags:
 *       - Movies
 *     description: Get list of movies by genre
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         description: Name of the movie genre
 *         schema:
 *           type: string
 *         example: 'action'
 *     responses:
 *       200:
 *         description: Array of movies in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResponseMovie'
 *       404:
 *         description: Movies not found
 */

router.get(routes.genreParams, MoviesController.searchMoviesByGenre);

export default router;
