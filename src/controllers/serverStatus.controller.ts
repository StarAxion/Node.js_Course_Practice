import { Request, Response } from 'express';

import { statusCodes, SERVER_STATUS_MSG } from '../utils/constants';

const serverStatusCheck = (req: Request, res: Response): void => {
  res.status(statusCodes.OK).json({ status: SERVER_STATUS_MSG });
};

export default serverStatusCheck;
