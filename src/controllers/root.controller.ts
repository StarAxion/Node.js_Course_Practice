import { Request, Response } from 'express';

import { statusCodes, routes } from '../utils/constants';

const rootRedirect = (req: Request, res: Response): void => {
  res.status(statusCodes.FOUND).redirect(routes.movies);
};

export default rootRedirect;
