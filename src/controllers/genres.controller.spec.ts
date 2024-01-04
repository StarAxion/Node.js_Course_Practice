import { Request, Response, NextFunction } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import GenresController from './genres.controller';

import GenreModel from '../models/genre.model';
import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

jest.mock('../models/genre.model');
jest.mock('../utils/initCustomError');

describe('GenresController', () => {
  const genres = [{ id: '123abc', name: 'action' }];
  const genre = genres[0];
  const { mockClear } = getMockRes();
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClear();
    mockReq = getMockReq();
    mockRes = getMockRes().res;
    mockNext = getMockRes().next;
  });

  describe('getAllGenres method', () => {
    it('should call find method of GenreModel', async () => {
      await GenresController.getAllGenres(mockReq, mockRes, mockNext);
      expect(GenreModel.find).toHaveBeenCalled();
    });

    it('should call sort method on found genres with genre name as sorting option', async () => {
      const sortSpy = jest.fn().mockResolvedValueOnce(genres);
      (GenreModel.find as jest.Mock).mockReturnValueOnce({
        sort: sortSpy
      });
      await GenresController.getAllGenres(mockReq, mockRes, mockNext);
      expect(sortSpy).toHaveBeenCalledWith({ name: 1 });
    });

    describe('when genres are found', () => {
      beforeEach(async () => {
        (GenreModel.find as jest.Mock).mockReturnValueOnce({
          sort: jest.fn().mockResolvedValueOnce(genres)
        });
        await GenresController.getAllGenres(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with found genres array in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(genres);
      });
    });

    it('should call initCustomError function with correct arguments when genres are not found', async () => {
      (GenreModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([])
      });
      await GenresController.getAllGenres(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genresListNotFound
      );
    });

    it('should call initCustomError function with correct arguments when genres cannot be found', async () => {
      (GenreModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error())
      });
      await GenresController.getAllGenres(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genresListNotFound
      );
    });
  });

  describe('createGenre method', () => {
    beforeEach(() => {
      mockReq.body = genre;
    });

    it('should call findOne method of GenreModel with genre name', async () => {
      await GenresController.createGenre(mockReq, mockRes, mockNext);
      expect(GenreModel.findOne).toHaveBeenCalledWith({ name: genre.name });
    });

    it('should call initCustomError function with correct arguments when duplicate genre is found', async () => {
      (GenreModel.findOne as jest.Mock).mockResolvedValueOnce(genre);
      await GenresController.createGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.CONFLICT,
        errorMessages.genreConflict
      );
    });

    describe('when duplicate genre is not found', () => {
      beforeEach(() => {
        (GenreModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      });

      it('should call save method of GenreModel instance', async () => {
        GenreModel.prototype.save = jest.fn();
        const genreModel = new GenreModel(genre);
        await GenresController.createGenre(mockReq, mockRes, mockNext);
        expect(genreModel.save).toHaveBeenCalled();
      });

      beforeEach(async () => {
        (GenreModel.prototype.save as jest.Mock).mockResolvedValueOnce(genre);
        await GenresController.createGenre(mockReq, mockRes, mockNext);
      });

      it('should set response status to CREATED', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.CREATED);
      });

      it('should respond with created genre object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(genre);
      });
    });

    it('should call initCustomError function with correct arguments when genre is not valid', async () => {
      const error = new Error('Genre is invalid');
      (GenreModel.prototype.save as jest.Mock).mockRejectedValueOnce(error);
      await GenresController.createGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.BAD_REQUEST,
        error.message,
        error.name
      );
    });
  });

  describe('getGenreById method', () => {
    beforeEach(() => {
      mockReq.params.id = genre.id;
    });

    it('should call findById method of GenreModel with genre id', async () => {
      await GenresController.getGenreById(mockReq, mockRes, mockNext);
      expect(GenreModel.findById).toHaveBeenCalledWith(genre.id);
    });

    describe('when genre is found', () => {
      beforeEach(async () => {
        (GenreModel.findById as jest.Mock).mockResolvedValueOnce(genre);
        await GenresController.getGenreById(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with found genre object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(genre);
      });
    });

    it('should call initCustomError function with correct arguments when genre is not found', async () => {
      (GenreModel.findById as jest.Mock).mockResolvedValueOnce(null);
      await GenresController.getGenreById(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });

    it('should call initCustomError function with correct arguments when genre cannot be found', async () => {
      (GenreModel.findById as jest.Mock).mockRejectedValueOnce(new Error());
      await GenresController.getGenreById(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });
  });

  describe('updateGenre method', () => {
    beforeEach(() => {
      mockReq.params.id = genre.id;
      mockReq.body = genre;
    });

    it('should call findOne method of GenreModel with genre id and name', async () => {
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(GenreModel.findOne).toHaveBeenCalledWith({
        _id: { $ne: genre.id },
        name: genre.name
      });
    });

    it('should call initCustomError function with correct arguments when duplicate genre is found', async () => {
      (GenreModel.findOne as jest.Mock).mockResolvedValueOnce(genre);
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.CONFLICT,
        errorMessages.genreConflict
      );
    });

    it('should call findByIdAndUpdate method of GenreModel with correct arguments when duplicate genre is not found', async () => {
      (GenreModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(GenreModel.findByIdAndUpdate).toHaveBeenCalledWith(
        genre.id,
        genre,
        { new: true, runValidators: true }
      );
    });

    describe('when genre is found and updated', () => {
      beforeEach(async () => {
        (GenreModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
          genre
        );
        await GenresController.updateGenre(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with updated genre object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(genre);
      });
    });

    it('should call initCustomError function with correct arguments when genre is not found', async () => {
      (GenreModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });

    it('should call initCustomError function with correct arguments when genre is not valid', async () => {
      const error = new Error('Genre is invalid');
      (GenreModel.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(error);
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.BAD_REQUEST,
        error.message,
        error.name
      );
    });

    it('should call initCustomError function with correct arguments when genre cannot be found', async () => {
      (GenreModel.findOne as jest.Mock).mockRejectedValueOnce(new Error());
      await GenresController.updateGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });
  });

  describe('deleteGenre method', () => {
    beforeEach(() => {
      mockReq.params.id = genre.id;
    });

    it('should call findByIdAndDelete method of GenreModel with genre id', async () => {
      await GenresController.deleteGenre(mockReq, mockRes, mockNext);
      expect(GenreModel.findByIdAndDelete).toHaveBeenCalledWith(genre.id);
    });

    describe('when genre is found and deleted', () => {
      beforeEach(async () => {
        (GenreModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
          id: genre.id
        });
        await GenresController.deleteGenre(mockReq, mockRes, mockNext);
      });

      it('should set response status to NO_CONTENT', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.NO_CONTENT);
      });

      it('should send response', () => {
        expect(mockRes.send).toHaveBeenCalled();
      });
    });

    it('should call initCustomError function with correct arguments when genre is not found', async () => {
      (GenreModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
      await GenresController.deleteGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });

    it('should call initCustomError function with correct arguments when genre cannot be found', async () => {
      (GenreModel.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(
        new Error()
      );
      await GenresController.deleteGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.genreNotFound
      );
    });
  });
});
