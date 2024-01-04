import mongoose from 'mongoose';

import MovieModel, { MovieBody, IMovie } from './movie.model';

import { connectToDatabase, disconnectFromDatabase } from '../utils/database';
import GenreModel from './genre.model';

jest.mock('./genre.model');

describe('movie model', () => {
  let movieBody: MovieBody;

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation();
    await connectToDatabase();
  });

  beforeEach(async () => {
    movieBody = {
      title: 'Title',
      description: 'Description',
      releaseDate: new Date(),
      genre: ['action', 'adventure']
    };
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe('validate method', () => {
    it('should return undefined if movie model is valid', async () => {
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).resolves.toBeUndefined();
    });

    it('should throw validation error if title property value is an empty string', async () => {
      movieBody.title = '';
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should throw validation error if string length of description property value is short', async () => {
      movieBody.description = 'Test';
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should throw validation error if releaseDate property value is invalid', async () => {
      movieBody.releaseDate = new Date('');
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should throw validation error if genre property value is an empty array', async () => {
      movieBody.genre = [];
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should throw validation error if element value of genre property array is an empty string', async () => {
      movieBody.genre = [''];
      const movie: IMovie = new MovieModel(movieBody);
      await expect(movie.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });
  });

  it('should trim the title property value', async () => {
    movieBody.title = ' Title ';
    const movie: IMovie = await MovieModel.create(movieBody);
    expect(movie.title).toBe('Title');
  });

  it('should trim the description property value', async () => {
    movieBody.description = ' Description ';
    const movie: IMovie = await MovieModel.create(movieBody);
    expect(movie.description).toBe('Description');
  });

  it('should trim and lowercase element value of genre property array', async () => {
    movieBody.genre = [' Action '];
    const movie: IMovie = await MovieModel.create(movieBody);
    expect(movie.genre[0]).toBe('action');
  });

  describe('pre-save hook', () => {
    const genreName: string = 'action';

    beforeEach(() => {
      movieBody.genre = [genreName];
      jest.clearAllMocks();
    });

    it('should not create genre if it already exists', async () => {
      (GenreModel.findOne as jest.Mock).mockResolvedValueOnce({
        name: genreName
      });
      await MovieModel.create(movieBody);
      expect(GenreModel.create).not.toHaveBeenCalled();
    });

    it('should create genre if it does not already exist', async () => {
      (GenreModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      await MovieModel.create(movieBody);
      expect(GenreModel.create).toHaveBeenCalledWith({
        name: genreName
      });
    });
  });
});
