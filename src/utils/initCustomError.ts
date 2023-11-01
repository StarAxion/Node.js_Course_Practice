import { type NextFunction } from 'express';

import { type CustomError } from '../models/customError.model';

const initCustomError = (
  next: NextFunction,
  status: number,
  message: string,
  name?: string
): void => {
  const error: CustomError = new Error(message);
  error.status = status;
  if (name) {
    error.name = name;
  }
  next(error);
};

export default initCustomError;
