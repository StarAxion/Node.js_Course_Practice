import mainRouter from './index';

import apiDocsRouter from './api-docs.route';
import serverStatusRouter from './serverStatus.route';
import moviesRouter from './movies.routes';
import genresRouter from './genres.routes';
import rootRedirect from '../controllers/root.controller';
import notFoundErrorHandler from '../controllers/notFoundError.controller';
import { routes } from '../utils/constants';

describe('main router', () => {
  it('should call GET method with root path and rootRedirect handler', () => {
    expect(mainRouter.get).toHaveBeenCalledWith(routes.root, rootRedirect);
  });

  it('should call USE method with apiDocs router', () => {
    expect(mainRouter.use).toHaveBeenCalledWith(apiDocsRouter);
  });

  it('should call USE method with serverStatus router', () => {
    expect(mainRouter.use).toHaveBeenCalledWith(serverStatusRouter);
  });

  it('should call USE method with movies path and movies router', () => {
    expect(mainRouter.use).toHaveBeenCalledWith(routes.movies, moviesRouter);
  });

  it('should call USE method with genres path and genres router', () => {
    expect(mainRouter.use).toHaveBeenCalledWith(routes.genres, genresRouter);
  });

  it('should call USE method with notFoundErrorHandler', () => {
    expect(mainRouter.use).toHaveBeenCalledWith(notFoundErrorHandler);
  });
});
