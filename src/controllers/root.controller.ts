import { type Request, type Response } from 'express';

import { statusCodes } from '../utils/constants';

const rootRedirect = (req: Request, res: Response): void => {
  res.status(statusCodes.FOUND).redirect('/api/movies');
};

export default rootRedirect;
