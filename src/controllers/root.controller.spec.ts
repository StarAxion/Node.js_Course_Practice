import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import rootRedirect from './root.controller';

import { statusCodes, routes } from '../utils/constants';

describe('rootRedirect controller', () => {
  const { mockClear } = getMockRes();
  let mockReq: Request;
  let mockRes: Response;

  beforeEach(() => {
    mockClear();
    mockReq = getMockReq();
    mockRes = getMockRes().res;
    rootRedirect(mockReq, mockRes);
  });

  it('should set response status to FOUND', () => {
    expect(mockRes.status).toHaveBeenCalledWith(statusCodes.FOUND);
  });

  it('should redirect to movies route', () => {
    expect(mockRes.redirect).toHaveBeenCalledWith(routes.movies);
  });
});
