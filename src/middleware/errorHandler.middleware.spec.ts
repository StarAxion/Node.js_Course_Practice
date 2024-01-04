import { Request, Response, NextFunction } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import errorHandler from './errorHandler.middleware';

import { CustomError } from '../models/customError.model';
import { statusCodes, errorMessages } from '../utils/constants';

describe('errorHandler middleware', () => {
  const { mockClear } = getMockRes();
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  beforeEach(() => {
    mockClear();
    mockReq = getMockReq();
    mockRes = getMockRes().res;
    mockNext = getMockRes().next;
  });

  describe('when provided with error status and message', () => {
    const errMessage = errorMessages.pageNotFound;
    const mockError: CustomError = new Error(errMessage);
    mockError.name = 'Error';
    mockError.status = statusCodes.NOT_FOUND;

    beforeEach(() => {
      errorHandler(mockError, mockReq, mockRes, mockNext);
    });

    it('should set response status as error status', () => {
      expect(mockRes.status).toHaveBeenCalledWith(mockError.status);
    });

    it('should send JSON response with error status and message', () => {
      expect(mockRes.json).toHaveBeenCalledWith({
        [mockError.name]: {
          status: mockError.status,
          message: errMessage
        }
      });
    });
  });

  describe('when error status and message are not provided', () => {
    const defStatus = statusCodes.INTERNAL_SERVER_ERROR;
    const defMessage = errorMessages.serverError;
    const mockError = new Error();
    mockError.name = 'Error';

    beforeEach(() => {
      errorHandler(mockError, mockReq, mockRes, mockNext);
    });

    it('should set response status as default status', () => {
      expect(mockRes.status).toHaveBeenCalledWith(defStatus);
    });

    it('should send JSON response with default status and message', () => {
      expect(mockRes.json).toHaveBeenCalledWith({
        [mockError.name]: {
          status: defStatus,
          message: defMessage
        }
      });
    });
  });

  it('should log error stack to the console when handling internal server error', () => {
    const mockError: CustomError = new Error(errorMessages.serverError);
    mockError.status = statusCodes.INTERNAL_SERVER_ERROR;
    errorHandler(mockError, mockReq, mockRes, mockNext);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError.stack);
  });
});
