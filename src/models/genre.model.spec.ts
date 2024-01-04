import mongoose from 'mongoose';

import GenreModel, { IGenre } from './genre.model';

import { connectToDatabase, disconnectFromDatabase } from '../utils/database';

describe('genre model', () => {
  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation();
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe('validate method', () => {
    it('should return undefined if genre model is valid', async () => {
      const genre: IGenre = new GenreModel({ name: 'action' });
      await expect(genre.validate()).resolves.toBeUndefined();
    });

    it('should throw validation error if name property value is an empty string', async () => {
      const genre: IGenre = new GenreModel({ name: '' });
      await expect(genre.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });
  });

  it('should trim and lowercase the name property value', async () => {
    const genre = await GenreModel.create({ name: ' Action ' });
    expect(genre.name).toBe('action');
  });
});
