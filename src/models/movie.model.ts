import mongoose, { Document, Schema } from 'mongoose';

import GenreModel from './genre.model';

import { validationMessages, minTextLength } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestMovie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - releaseDate
 *         - genre
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the movie
 *           example: "Movie Title"
 *         description:
 *           type: string
 *           description: Description of the movie
 *           example: "Movie description"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie
 *           example: "2023-10-31"
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres of the movie
 *           example: ["action", "adventure"]
 *       example:
 *         title: "Movie Title"
 *         description: "Movie description"
 *         releaseDate: "2023-10-31"
 *         genre: ["action", "adventure"]
 *     ResponseMovie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the Movie document
 *           example: "123abc"
 *         title:
 *           type: string
 *           description: Title of the movie
 *           example: "Movie Title"
 *         description:
 *           type: string
 *           description: Description of the movie
 *           example: "Movie description"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie
 *           example: "2023-10-31"
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres of the movie
 *           example: ["action", "adventure"]
 *         __v:
 *           type: number
 *           description: Version key of the Movie document
 *           example: 0
 *       example:
 *         _id: "123abc"
 *         title: "Movie Title"
 *         description: "Movie description"
 *         releaseDate: "2023-10-31"
 *         genre: ["action", "adventure"]
 *         __v: 0
 */

export interface MovieBody {
  title: string;
  description: string;
  releaseDate: Date;
  genre: string[];
}

export interface IMovie extends MovieBody, Document {}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: [true, validationMessages.movieTitle],
    trim: true
  },
  description: {
    type: String,
    required: [true, validationMessages.movieDescription],
    trim: true,
    minLength: [minTextLength, validationMessages.movieDescriptionLength]
  },
  releaseDate: {
    type: Date,
    required: [true, validationMessages.movieReleaseDate]
  },
  genre: {
    type: [
      {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (genre: string) => genre,
          message: validationMessages.movieGenre
        }
      }
    ],
    validate: {
      validator: (arr: string[]) => arr.length > 0,
      message: validationMessages.movieGenre
    }
  }
});

movieSchema.pre('save', async function (next) {
  for (const genre of this.genre) {
    const existingGenre = await GenreModel.findOne({ name: genre });
    if (!existingGenre) {
      await GenreModel.create({ name: genre });
    }
  }
  next();
});

const MovieModel = mongoose.model<IMovie>('Movie', movieSchema);

export default MovieModel;
