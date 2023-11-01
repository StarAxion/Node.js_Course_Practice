import { type Request, type Response, type NextFunction } from 'express';

import { type CustomError } from '../models/customError.model';

import { statusCodes, errorMessages } from '../utils/constants';

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.status = err.status ?? statusCodes.INTERNAL_SERVER_ERROR;
  err.message = err.message || errorMessages.serverError;
  if (err.status === statusCodes.INTERNAL_SERVER_ERROR) {
    console.error(err.stack);
  }
  res.status(err.status).json({
    [err.name]: {
      status: err.status,
      message: err.message
    }
  });
};

export default errorHandler;
