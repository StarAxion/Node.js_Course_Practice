import { Request, Response, NextFunction } from 'express';

import MovieModel, { MovieBody } from '../models/movie.model';
import { ReqParamsId, ReqParamsGenreName } from '../models/ReqParams.model';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

class MoviesController {
  static async getAllMovies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const movies = await MovieModel.find().sort({ releaseDate: -1 });

      if (movies.length) {
        res.status(statusCodes.OK).json(movies);
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.moviesListNotFound
        );
      }
    } catch (err) {
      initCustomError(
        next,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    }
  }

  static async createMovie(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body as MovieBody;
      const title = new RegExp(`^${body.title?.trim()}$`, 'i');
      const releaseDate = body.releaseDate;
      const duplicate = await MovieModel.findOne({ title, releaseDate });

      if (duplicate) {
        initCustomError(
          next,
          statusCodes.CONFLICT,
          errorMessages.movieConflict
        );
      } else {
        const movie = await new MovieModel(body).save();
        res.status(statusCodes.CREATED).json(movie);
      }
    } catch (err) {
      initCustomError(next, statusCodes.BAD_REQUEST, err.message, err.name);
    }
  }

  static async getMovieById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const movie = await MovieModel.findById(id);

      if (movie) {
        res.status(statusCodes.OK).json(movie);
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.movieNotFound
        );
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.movieNotFound);
    }
  }

  static async updateMovie(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const body = req.body as MovieBody;
      const title = new RegExp(`^${body.title?.trim()}$`, 'i');
      const releaseDate = body.releaseDate;
      const duplicate = await MovieModel.findOne({
        _id: { $ne: id },
        title,
        releaseDate
      });

      if (duplicate) {
        initCustomError(
          next,
          statusCodes.CONFLICT,
          errorMessages.movieConflict
        );
      } else {
        try {
          const movie = await MovieModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
          });

          if (movie) {
            res.status(statusCodes.OK).json(movie);
          } else {
            initCustomError(
              next,
              statusCodes.NOT_FOUND,
              errorMessages.movieNotFound
            );
          }
        } catch (err) {
          initCustomError(next, statusCodes.BAD_REQUEST, err.message, err.name);
        }
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.movieNotFound);
    }
  }

  static async deleteMovie(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const movie = await MovieModel.findByIdAndDelete(id);

      if (movie) {
        res.status(statusCodes.NO_CONTENT).send();
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.movieNotFound
        );
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.movieNotFound);
    }
  }

  static async searchMoviesByGenre(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsGenreName;
      const { genreName } = params;
      const movies = await MovieModel.find({ genre: genreName }).sort({
        releaseDate: -1
      });

      if (movies.length) {
        res.status(statusCodes.OK).json(movies);
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.moviesListNotFound
        );
      }
    } catch (err) {
      initCustomError(
        next,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    }
  }
}

export default MoviesController;
