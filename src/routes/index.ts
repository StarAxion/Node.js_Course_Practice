import { Router } from 'express';

import apiDocsRouter from './api-docs.route';
import serverStatusRouter from './serverStatus.route';
import moviesRouter from './movies.routes';
import genresRouter from './genres.routes';

import { routes } from '../utils/constants';
import rootRedirect from '../controllers/root.controller';
import notFoundErrorHandler from '../controllers/notFoundError.controller';

const router = Router();

router.get(routes.root, rootRedirect);
router.use(apiDocsRouter);
router.use(serverStatusRouter);
router.use(routes.movies, moviesRouter);
router.use(routes.genres, genresRouter);
router.use(notFoundErrorHandler);

export default router;
