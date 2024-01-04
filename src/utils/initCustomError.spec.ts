import { NextFunction } from 'express';

import initCustomError from './initCustomError';

import { CustomError } from '../models/customError.model';
import { statusCodes, errorMessages } from './constants';

describe('initCustomError function', () => {
  it('should create and pass custom error to the next middleware', () => {
    const mockNext: NextFunction = jest.fn();
    const errStatus = statusCodes.NOT_FOUND;
    const errMessage = errorMessages.pageNotFound;
    const errName = 'CustomError';
    initCustomError(mockNext, errStatus, errMessage, errName);
    const customError: CustomError = new Error(errMessage);
    customError.status = errStatus;
    customError.name = errName;
    expect(mockNext).toHaveBeenCalledWith(customError);
  });
});
