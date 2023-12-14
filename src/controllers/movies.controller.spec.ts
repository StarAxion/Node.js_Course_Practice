import { Request, Response, NextFunction } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import MoviesController from './movies.controller';

import MovieModel from '../models/movie.model';
import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

jest.mock('../models/movie.model');
jest.mock('../utils/initCustomError');

describe('MoviesController', () => {
  const movies = [
    {
      id: '123abc',
      title: 'Title',
      description: 'Description',
      releaseDate: new Date(),
      genre: ['action', 'adventure']
    }
  ];
  const movie = movies[0];
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

  describe('getAllMovies method', () => {
    it('should call find method of MovieModel', async () => {
      await MoviesController.getAllMovies(mockReq, mockRes, mockNext);
      expect(MovieModel.find).toHaveBeenCalled();
    });

    it('should call sort method on found movies with movie releaseDate as sorting option', async () => {
      const sortSpy = jest.fn().mockResolvedValueOnce(movies);
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: sortSpy
      });
      await MoviesController.getAllMovies(mockReq, mockRes, mockNext);
      expect(sortSpy).toHaveBeenCalledWith({ releaseDate: -1 });
    });

    describe('when movies are found', () => {
      beforeEach(async () => {
        (MovieModel.find as jest.Mock).mockReturnValueOnce({
          sort: jest.fn().mockResolvedValueOnce(movies)
        });
        await MoviesController.getAllMovies(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with found movies array in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(movies);
      });
    });

    it('should call initCustomError function with correct arguments when movies are not found', async () => {
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([])
      });
      await MoviesController.getAllMovies(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    });

    it('should call initCustomError function with correct arguments when movies cannot be found', async () => {
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error())
      });
      await MoviesController.getAllMovies(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    });
  });

  describe('createMovie method', () => {
    beforeEach(() => {
      mockReq.body = movie;
    });

    it('should call findOne method of MovieModel with movie title and releaseDate', async () => {
      await MoviesController.createMovie(mockReq, mockRes, mockNext);
      expect(MovieModel.findOne).toHaveBeenCalledWith({
        title: new RegExp(`^${movie.title}$`, 'i'),
        releaseDate: movie.releaseDate
      });
    });

    it('should call initCustomError function with correct arguments when duplicate movie is found', async () => {
      (MovieModel.findOne as jest.Mock).mockResolvedValueOnce(movie);
      await MoviesController.createMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.CONFLICT,
        errorMessages.movieConflict
      );
    });

    describe('when duplicate movie is not found', () => {
      beforeEach(() => {
        (MovieModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      });

      it('should call save method of MovieModel instance', async () => {
        MovieModel.prototype.save = jest.fn();
        const movieModel = new MovieModel(movie);
        await MoviesController.createMovie(mockReq, mockRes, mockNext);
        expect(movieModel.save).toHaveBeenCalled();
      });

      beforeEach(async () => {
        (MovieModel.prototype.save as jest.Mock).mockResolvedValueOnce(movie);
        await MoviesController.createMovie(mockReq, mockRes, mockNext);
      });

      it('should set response status to CREATED', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.CREATED);
      });

      it('should respond with created movie object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(movie);
      });
    });

    it('should call initCustomError function with correct arguments when movie is not valid', async () => {
      const error = new Error('Movie is invalid');
      (MovieModel.prototype.save as jest.Mock).mockRejectedValueOnce(error);
      await MoviesController.createMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.BAD_REQUEST,
        error.message,
        error.name
      );
    });
  });

  describe('getMovieById method', () => {
    beforeEach(() => {
      mockReq.params.id = movie.id;
    });

    it('should call findById method of MovieModel with movie id', async () => {
      await MoviesController.getMovieById(mockReq, mockRes, mockNext);
      expect(MovieModel.findById).toHaveBeenCalledWith(movie.id);
    });

    describe('when movie is found', () => {
      beforeEach(async () => {
        (MovieModel.findById as jest.Mock).mockResolvedValueOnce(movie);
        await MoviesController.getMovieById(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with found movie object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(movie);
      });
    });

    it('should call initCustomError function with correct arguments when movie is not found', async () => {
      (MovieModel.findById as jest.Mock).mockResolvedValueOnce(null);
      await MoviesController.getMovieById(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });

    it('should call initCustomError function with correct arguments when movie cannot be found', async () => {
      (MovieModel.findById as jest.Mock).mockRejectedValueOnce(new Error());
      await MoviesController.getMovieById(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });
  });

  describe('updateMovie method', () => {
    beforeEach(() => {
      mockReq.params.id = movie.id;
      mockReq.body = movie;
    });

    it('should call findOne method of MovieModel with movie id, title and releaseDate', async () => {
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(MovieModel.findOne).toHaveBeenCalledWith({
        _id: { $ne: movie.id },
        title: new RegExp(`^${movie.title}$`, 'i'),
        releaseDate: movie.releaseDate
      });
    });

    it('should call initCustomError function with correct arguments when duplicate movie is found', async () => {
      (MovieModel.findOne as jest.Mock).mockResolvedValueOnce(movie);
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.CONFLICT,
        errorMessages.movieConflict
      );
    });

    it('should call findByIdAndUpdate method of MovieModel with correct arguments when duplicate movie is not found', async () => {
      (MovieModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(MovieModel.findByIdAndUpdate).toHaveBeenCalledWith(
        movie.id,
        movie,
        { new: true, runValidators: true }
      );
    });

    describe('when movie is found and updated', () => {
      beforeEach(async () => {
        (MovieModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
          movie
        );
        await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with updated movie object in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(movie);
      });
    });

    it('should call initCustomError function with correct arguments when movie is not found', async () => {
      (MovieModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });

    it('should call initCustomError function with correct arguments when movie is not valid', async () => {
      const error = new Error('Movie is invalid');
      (MovieModel.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(error);
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.BAD_REQUEST,
        error.message,
        error.name
      );
    });

    it('should call initCustomError function with correct arguments when movie cannot be found', async () => {
      (MovieModel.findOne as jest.Mock).mockRejectedValueOnce(new Error());
      await MoviesController.updateMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });
  });

  describe('deleteMovie method', () => {
    beforeEach(() => {
      mockReq.params.id = movie.id;
    });

    it('should call findByIdAndDelete method of MovieModel with movie id', async () => {
      await MoviesController.deleteMovie(mockReq, mockRes, mockNext);
      expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith(movie.id);
    });

    describe('when movie is found and deleted', () => {
      beforeEach(async () => {
        (MovieModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
          id: movie.id
        });
        await MoviesController.deleteMovie(mockReq, mockRes, mockNext);
      });

      it('should set response status to NO_CONTENT', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.NO_CONTENT);
      });

      it('should send response', () => {
        expect(mockRes.send).toHaveBeenCalled();
      });
    });

    it('should call initCustomError function with correct arguments when movie is not found', async () => {
      (MovieModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
      await MoviesController.deleteMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });

    it('should call initCustomError function with correct arguments when movie cannot be found', async () => {
      (MovieModel.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(
        new Error()
      );
      await MoviesController.deleteMovie(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.movieNotFound
      );
    });
  });

  describe('searchMoviesByGenre method', () => {
    beforeEach(() => {
      mockReq.params.genreName = movie.genre[0];
    });

    it('should call find method of MovieModel', async () => {
      await MoviesController.searchMoviesByGenre(mockReq, mockRes, mockNext);
      expect(MovieModel.find).toHaveBeenCalled();
    });

    it('should call sort method on found movies with movie releaseDate as sorting option', async () => {
      const sortSpy = jest.fn().mockResolvedValueOnce(movies);
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: sortSpy
      });
      await MoviesController.searchMoviesByGenre(mockReq, mockRes, mockNext);
      expect(sortSpy).toHaveBeenCalledWith({ releaseDate: -1 });
    });

    describe('when movies are found', () => {
      beforeEach(async () => {
        (MovieModel.find as jest.Mock).mockReturnValueOnce({
          sort: jest.fn().mockResolvedValueOnce(movies)
        });
        await MoviesController.searchMoviesByGenre(mockReq, mockRes, mockNext);
      });

      it('should set response status to OK', () => {
        expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
      });

      it('should respond with found movies array in JSON format', () => {
        expect(mockRes.json).toHaveBeenCalledWith(movies);
      });
    });

    it('should call initCustomError function with correct arguments when movies are not found', async () => {
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([])
      });
      await MoviesController.searchMoviesByGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    });

    it('should call initCustomError function with correct arguments when movies cannot be found', async () => {
      (MovieModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error())
      });
      await MoviesController.searchMoviesByGenre(mockReq, mockRes, mockNext);
      expect(initCustomError).toHaveBeenCalledWith(
        mockNext,
        statusCodes.NOT_FOUND,
        errorMessages.moviesListNotFound
      );
    });
  });
});
