import {
  Router,
  type Request,
  type Response,
  type NextFunction
} from 'express';

import apiDocsRoute from './api-docs';
import serverStatusRoute from './serverStatus';
import coursesRoutes from './courses';

import { type CustomError } from '../models/customError';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.redirect('/courses');
});

router.use(apiDocsRoute);

router.use(serverStatusRoute);

router.use('/courses', coursesRoutes);

router.use((req: Request, res: Response, next: NextFunction): void => {
  const error: CustomError = new Error('Page not found');
  error.status = 404;
  next(error);
});

export default router;
