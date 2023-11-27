import { Request, Response } from 'express';

import { statusCodes } from '../utils/constants';

const serverStatusCheck = (req: Request, res: Response): void => {
  res.status(statusCodes.OK).json({ status: 'The server is running' });
};

export default serverStatusCheck;
