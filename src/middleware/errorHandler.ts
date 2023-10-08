import { type Request, type Response, type NextFunction } from 'express';

import { type CustomError } from '../models/customError';

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const serverErrStatus: number = 500;
  err.status = err.status ?? serverErrStatus;
  err.message = err.message || 'An unexpected error occurred on the server';
  if (err.status === serverErrStatus) {
    console.error(err.stack);
  }
  res.status(err.status).json({
    status: err.status,
    message: err.message
  });
};

export default errorHandler;
