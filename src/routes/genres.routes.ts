import { Router } from 'express';

import GenresController from '../controllers/genres.controller';

const router = Router();

/**
 * @swagger
 * /api/genres:
 *   get:
 *     tags:
 *       - Genres
 *     description: Get list of genres
 *     responses:
 *       200:
 *         description: Array of genres in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResponseGenre'
 *       404:
 *         description: Genres not found
 *   post:
 *     tags:
 *       - Genres
 *     description: Create new genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestGenre'
 *     responses:
 *       201:
 *         description: Genre created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseGenre'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Genre already exists
 */

router.get('/', GenresController.getAllGenres);
router.post('/', GenresController.createGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     tags:
 *       - Genres
 *     description: Get genre by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the genre
 *         schema:
 *           type: string
 *         example: "123abc"
 *     responses:
 *       200:
 *         description: Genre data in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseGenre'
 *       404:
 *         description: Genre not found
 *   put:
 *     tags:
 *       - Genres
 *     description: Update genre by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the genre
 *         schema:
 *           type: string
 *         example: "123abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestGenre'
 *     responses:
 *       200:
 *         description: Genre updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseGenre'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Genre not found
 *       409:
 *         description: Genre already exists
 *   delete:
 *     tags:
 *       - Genres
 *     description: Delete genre by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the genre
 *         schema:
 *           type: string
 *         example: "123abc"
 *     responses:
 *       204:
 *         description: Genre deleted
 *       404:
 *         description: Genre not found
 */

router.get('/:id', GenresController.getGenreById);
router.put('/:id', GenresController.updateGenre);
router.delete('/:id', GenresController.deleteGenre);

export default router;
