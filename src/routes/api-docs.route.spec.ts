import apiDocsRouter from './api-docs.route';

import setupSwagger from '../utils/swaggerConfig';
import { routes } from '../utils/constants';

jest.mock('../utils/swaggerConfig');

describe('apiDocs router', () => {
  it('should call setupSwagger function with apiDocs router and apiDocs path', () => {
    expect(setupSwagger).toHaveBeenCalledWith(apiDocsRouter, routes.apiDocs);
  });
});
