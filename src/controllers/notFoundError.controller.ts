import { type Request, type Response, type NextFunction } from 'express';

import initCustomError from '../utils/initCustomError';
import { statusCodes, errorMessages } from '../utils/constants';

const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  initCustomError(next, statusCodes.NOT_FOUND, errorMessages.pageNotFound);
};

export default notFoundErrorHandler;
