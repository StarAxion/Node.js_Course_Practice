import mongoose from 'mongoose';

import { connectToDatabase, disconnectFromDatabase } from './database';

import { NO_DB_URI } from './constants';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn()
}));

describe('database', () => {
  beforeAll(() => {
    process.env.NODE_ENV = '';
    jest.spyOn(console, 'log').mockImplementation();
  });

  describe('connectToDatabase function', () => {
    it('should successfully connect to the database if DB_URI is valid', async () => {
      process.env.DB_URI = 'mongodb+srv://test';
      await connectToDatabase();
      expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URI);
    });

    it('should throw an error with specific error message when connection fails', async () => {
      const errMessage = 'Connection error';
      jest
        .spyOn(mongoose, 'connect')
        .mockRejectedValueOnce(new Error(errMessage));
      await expect(connectToDatabase()).rejects.toThrow(errMessage);
    });

    it('should throw an error with specific message when DB_URI is missing', async () => {
      process.env.DB_URI = '';
      await expect(connectToDatabase()).rejects.toThrow(NO_DB_URI);
    });
  });

  describe('disconnectFromDatabase function', () => {
    it('should successfully disconnect from the database', async () => {
      await disconnectFromDatabase();
      expect(mongoose.disconnect).toHaveBeenCalled();
    });

    describe('when disconnect fails', () => {
      const errMessage = 'Disconnection error';
      const error = new Error(errMessage);
      let consoleErrorSpy: jest.SpyInstance;
      let processExitSpy: jest.SpyInstance;

      beforeAll(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
      });

      beforeEach(async () => {
        jest.clearAllMocks();
        (mongoose.disconnect as jest.Mock).mockRejectedValueOnce(error);
        await disconnectFromDatabase();
      });

      it('should log an error to the console', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      });

      it('should invoke process.exit with code 1', () => {
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });
    });
  });
});
