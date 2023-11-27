import { Request, Response, NextFunction } from 'express';

import GenreModel, { GenreBody } from '../models/genre.model';
import { ReqParamsId } from '../models/ReqParams.model';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

class GenresController {
  static async getAllGenres(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const genres = await GenreModel.find().sort({ name: 1 });

      if (genres.length) {
        res.status(statusCodes.OK).json(genres);
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genresListNotFound
        );
      }
    } catch (err) {
      initCustomError(
        next,
        statusCodes.NOT_FOUND,
        errorMessages.genresListNotFound
      );
    }
  }

  static async createGenre(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body as GenreBody;
      const name = body.name?.trim().toLowerCase();
      const duplicate = await GenreModel.findOne({ name });

      if (duplicate) {
        initCustomError(
          next,
          statusCodes.CONFLICT,
          errorMessages.genreConflict
        );
      } else {
        const genre = await new GenreModel(body).save();
        res.status(statusCodes.CREATED).json(genre);
      }
    } catch (err) {
      initCustomError(next, statusCodes.BAD_REQUEST, err.message, err.name);
    }
  }

  static async getGenreById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const genre = await GenreModel.findById(id);

      if (genre) {
        res.status(statusCodes.OK).json(genre);
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genreNotFound
        );
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.genreNotFound);
    }
  }

  static async updateGenre(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const body = req.body as GenreBody;
      const name = body.name?.trim().toLowerCase();
      const duplicate = await GenreModel.findOne({ _id: { $ne: id }, name });

      if (duplicate) {
        initCustomError(
          next,
          statusCodes.CONFLICT,
          errorMessages.genreConflict
        );
      } else {
        try {
          const genre = await GenreModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
          });

          if (genre) {
            res.status(statusCodes.OK).json(genre);
          } else {
            initCustomError(
              next,
              statusCodes.NOT_FOUND,
              errorMessages.genreNotFound
            );
          }
        } catch (err) {
          initCustomError(next, statusCodes.BAD_REQUEST, err.message, err.name);
        }
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.genreNotFound);
    }
  }

  static async deleteGenre(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.params as ReqParamsId;
      const { id } = params;
      const genre = await GenreModel.findByIdAndDelete(id);

      if (genre) {
        res.status(statusCodes.NO_CONTENT).send();
      } else {
        initCustomError(
          next,
          statusCodes.NOT_FOUND,
          errorMessages.genreNotFound
        );
      }
    } catch (err) {
      initCustomError(next, statusCodes.NOT_FOUND, errorMessages.genreNotFound);
    }
  }
}

export default GenresController;
