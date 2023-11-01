import { type Request, type Response, type NextFunction } from 'express';

import MovieModel, { type MovieBody } from '../models/movie.model';
import {
  type ReqParamsId,
  type ReqParamsGenreName
} from '../models/ReqParams.model';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

class MoviesController {
  static getAllMovies(req: Request, res: Response, next: NextFunction): void {
    MovieModel.find()
      .sort({ releaseDate: -1 })
      .then((movies) => {
        if (movies.length) {
          res.status(statusCodes.OK).json(movies);
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.moviesListNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.moviesListNotFound
        );
      });
  }

  static createMovie(req: Request, res: Response, next: NextFunction): void {
    const body = req.body as MovieBody;
    const title = body.title?.trim();
    const releaseDate = body.releaseDate;
    MovieModel.findOne({
      title: new RegExp(`^${title}$`, 'i'),
      releaseDate
    })
      .then((duplicate) => {
        if (duplicate) {
          initCustomError(
            next,
            statusCodes.CONFLICT,
            errorMessages.movieConflict
          );
        } else {
          new MovieModel(body)
            .save()
            .then((movie) => {
              res.status(statusCodes.CREATED).json(movie);
            })
            .catch((err) => {
              initCustomError(
                next,
                statusCodes.BAD_REQUEST,
                err.message,
                err.name
              );
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getMovieById(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    MovieModel.findById(id)
      .then((movie) => {
        if (movie) {
          res.status(statusCodes.OK).json(movie);
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.movieNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.movieNotFound
        );
      });
  }

  static updateMovie(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    const body = req.body as MovieBody;
    const title = body.title?.trim();
    const releaseDate = body.releaseDate;
    MovieModel.findOne({
      _id: { $ne: id },
      title: new RegExp(`^${title}$`, 'i'),
      releaseDate
    })
      .then((duplicate) => {
        if (duplicate) {
          initCustomError(
            next,
            statusCodes.CONFLICT,
            errorMessages.movieConflict
          );
        } else {
          MovieModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
          })
            .then((movie) => {
              if (movie) {
                res.status(statusCodes.OK).json(movie);
              } else {
                initCustomError(
                  next,
                  statusCodes.NOT_FOUND,
                  errorMessages.movieNotFound
                );
              }
            })
            .catch((err) => {
              initCustomError(
                next,
                statusCodes.BAD_REQUEST,
                err.message,
                err.name
              );
            });
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.movieNotFound
        );
      });
  }

  static deleteMovie(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    MovieModel.findByIdAndDelete(id)
      .then((movie) => {
        if (movie) {
          res.status(statusCodes.NO_CONTENT).send();
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.movieNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.movieNotFound
        );
      });
  }

  static searchMoviesByGenre(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const params = req.params as ReqParamsGenreName;
    const { genreName } = params;
    MovieModel.find({ genre: genreName })
      .sort({ releaseDate: -1 })
      .then((movies) => {
        if (movies.length) {
          res.status(statusCodes.OK).json(movies);
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.moviesListNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.moviesListNotFound
        );
      });
  }
}

export default MoviesController;
