import moviesRouter from './movies.routes';

import MoviesController from '../controllers/movies.controller';
import { routes } from '../utils/constants';

describe('movies router', () => {
  it('should call GET method with root path and getAllMovies handler', () => {
    expect(moviesRouter.get).toHaveBeenCalledWith(
      routes.root,
      MoviesController.getAllMovies
    );
  });

  it('should call POST method with root path and createMovie handler', () => {
    expect(moviesRouter.post).toHaveBeenCalledWith(
      routes.root,
      MoviesController.createMovie
    );
  });

  it('should call GET method with idParams path and getMovieById handler', () => {
    expect(moviesRouter.get).toHaveBeenCalledWith(
      routes.idParams,
      MoviesController.getMovieById
    );
  });

  it('should call PUT method with idParams path and updateMovie handler', () => {
    expect(moviesRouter.put).toHaveBeenCalledWith(
      routes.idParams,
      MoviesController.updateMovie
    );
  });

  it('should call DELETE method with idParams path and deleteMovie handler', () => {
    expect(moviesRouter.delete).toHaveBeenCalledWith(
      routes.idParams,
      MoviesController.deleteMovie
    );
  });

  it('should call GET method with genreParams path and searchMoviesByGenre handler', () => {
    expect(moviesRouter.get).toHaveBeenCalledWith(
      routes.genreParams,
      MoviesController.searchMoviesByGenre
    );
  });
});
