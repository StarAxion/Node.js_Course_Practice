import { Router } from 'express';

import apiDocsRoute from './api-docs.route';
import serverStatusRoute from './serverStatus.route';
import moviesRoutes from './movies.routes';
import genresRoutes from './genres.routes';

import rootRedirect from '../controllers/root.controller';
import notFoundErrorHandler from '../controllers/notFoundError.controller';

const router = Router();

router.get('/', rootRedirect);
router.use(apiDocsRoute);
router.use(serverStatusRoute);
router.use('/api/movies', moviesRoutes);
router.use('/api/genres', genresRoutes);
router.use(notFoundErrorHandler);

export default router;
