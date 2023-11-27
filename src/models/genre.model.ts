import mongoose, { Document, Schema } from 'mongoose';

import { validationMessages } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestGenre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the genre
 *           example: "action"
 *       example:
 *         name: "action"
 *     ResponseGenre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the Genre document
 *           example: "123abc"
 *         name:
 *           type: string
 *           description: Name of the genre
 *           example: "action"
 *         __v:
 *           type: number
 *           description: Version key of the Genre document
 *           example: 0
 *       example:
 *         _id: "123abc"
 *         name: "action"
 *         __v: 0
 */

export interface GenreBody {
  name: string;
}

export interface IGenre extends GenreBody, Document {}

const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: [true, validationMessages.genreName],
    trim: true,
    lowercase: true
  }
});

const GenreModel = mongoose.model<IGenre>('Genre', genreSchema);

export default GenreModel;
