import genresRouter from './genres.routes';

import GenresController from '../controllers/genres.controller';
import { routes } from '../utils/constants';

describe('genres router', () => {
  it('should call GET method with root path and getAllGenres handler', () => {
    expect(genresRouter.get).toHaveBeenCalledWith(
      routes.root,
      GenresController.getAllGenres
    );
  });

  it('should call POST method with root path and createGenre handler', () => {
    expect(genresRouter.post).toHaveBeenCalledWith(
      routes.root,
      GenresController.createGenre
    );
  });

  it('should call GET method with idParams path and getGenreById handler', () => {
    expect(genresRouter.get).toHaveBeenCalledWith(
      routes.idParams,
      GenresController.getGenreById
    );
  });

  it('should call PUT method with idParams path and updateGenre handler', () => {
    expect(genresRouter.put).toHaveBeenCalledWith(
      routes.idParams,
      GenresController.updateGenre
    );
  });

  it('should call DELETE method with idParams path and deleteGenre handler', () => {
    expect(genresRouter.delete).toHaveBeenCalledWith(
      routes.idParams,
      GenresController.deleteGenre
    );
  });
});
