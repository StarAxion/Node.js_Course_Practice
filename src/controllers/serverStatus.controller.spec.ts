import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import serverStatusCheck from './serverStatus.controller';

import { statusCodes, SERVER_STATUS_MSG } from '../utils/constants';

describe('serverStatusCheck controller', () => {
  const { mockClear } = getMockRes();
  let mockReq: Request;
  let mockRes: Response;

  beforeEach(() => {
    mockClear();
    mockReq = getMockReq();
    mockRes = getMockRes().res;
    serverStatusCheck(mockReq, mockRes);
  });

  it('should set response status to OK', () => {
    expect(mockRes.status).toHaveBeenCalledWith(statusCodes.OK);
  });

  it('should respond with server status message in JSON format', () => {
    expect(mockRes.json).toHaveBeenCalledWith({
      status: SERVER_STATUS_MSG
    });
  });
});
