import { Request, Response, NextFunction } from 'express';

import GenreModel, { GenreBody } from '../models/genre.model';
import { ReqParamsId } from '../models/ReqParams.model';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

class GenresController {
  static getAllGenres(req: Request, res: Response, next: NextFunction): void {
    GenreModel.find()
      .sort({ name: 1 })
      .then((genres) => {
        if (genres.length) {
          res.status(statusCodes.OK).json(genres);
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.genresListNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genresListNotFound
        );
      });
  }

  static createGenre(req: Request, res: Response, next: NextFunction): void {
    const body = req.body as GenreBody;
    const name = body.name?.trim().toLowerCase();
    GenreModel.findOne({ name })
      .then((duplicate) => {
        if (duplicate) {
          initCustomError(
            next,
            statusCodes.CONFLICT,
            errorMessages.genreConflict
          );
        } else {
          new GenreModel(body)
            .save()
            .then((genre) => {
              res.status(statusCodes.CREATED).json(genre);
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

  static getGenreById(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    GenreModel.findById(id)
      .then((genre) => {
        if (genre) {
          res.status(statusCodes.OK).json(genre);
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.genreNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genreNotFound
        );
      });
  }

  static updateGenre(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    const body = req.body as GenreBody;
    const name = body.name?.trim().toLowerCase();
    GenreModel.findOne({ _id: { $ne: id }, name })
      .then((duplicate) => {
        if (duplicate) {
          initCustomError(
            next,
            statusCodes.CONFLICT,
            errorMessages.genreConflict
          );
        } else {
          GenreModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
          })
            .then((genre) => {
              if (genre) {
                res.status(statusCodes.OK).json(genre);
              } else {
                initCustomError(
                  next,
                  statusCodes.NOT_FOUND,
                  errorMessages.genreNotFound
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
          errorMessages.genreNotFound
        );
      });
  }

  static deleteGenre(req: Request, res: Response, next: NextFunction): void {
    const params = req.params as ReqParamsId;
    const { id } = params;
    GenreModel.findByIdAndDelete(id)
      .then((genre) => {
        if (genre) {
          res.status(statusCodes.NO_CONTENT).send();
        } else {
          initCustomError(
            next,
            statusCodes.NOT_FOUND,
            errorMessages.genreNotFound
          );
        }
      })
      .catch(() => {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genreNotFound
        );
      });
  }
}

export default GenresController;
