const ENV_PORT: number = Number(process.env.PORT);
const PORT_NUM: number = 3000;

export const PORT: number = isNaN(ENV_PORT) ? PORT_NUM : ENV_PORT;

export const SERVER_URL: string = `http://localhost:${PORT}`;

export const minTextLength: number = 10;

export const statusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

export const errorMessages = {
  pageNotFound: 'Page not found',
  moviesListNotFound: 'Movies not found',
  movieNotFound: 'Movie not found',
  movieConflict: 'Movie already exists',
  genresListNotFound: 'Genres not found',
  genreNotFound: 'Genre not found',
  genreConflict: 'Genre already exists',
  serverError: 'Internal Server Error'
};

export const validationMessages = {
  movieTitle: 'Movie title is required',
  movieDescription: 'Movie description is required',
  movieDescriptionLength: `Description text length should be at least ${minTextLength} characters`,
  movieReleaseDate: 'Movie release date is required',
  movieGenre: 'Movie genre is required',
  genreName: 'Genre name is required'
};
