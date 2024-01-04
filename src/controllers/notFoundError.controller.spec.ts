import { Request, Response, NextFunction } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import notFoundErrorHandler from './notFoundError.controller';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

jest.mock('../utils/initCustomError');

describe('notFoundErrorHandler controller', () => {
  const { mockClear } = getMockRes();
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockClear();
    mockReq = getMockReq();
    mockRes = getMockRes().res;
    mockNext = getMockRes().next;
  });

  it('should call initCustomError function with correct arguments', () => {
    notFoundErrorHandler(mockReq, mockRes, mockNext);
    expect(initCustomError).toHaveBeenCalledWith(
      mockNext,
      statusCodes.NOT_FOUND,
      errorMessages.pageNotFound
    );
  });
});
