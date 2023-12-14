import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';

import setupSwagger from './swaggerConfig';

jest.mock('swagger-ui-express', () => ({
  serve: jest.fn(),
  setup: jest.fn()
}));

describe('setupSwagger function', () => {
  it('should call USE method of the router with correct arguments', () => {
    const router = Router();
    const path = '/swag';
    setupSwagger(router, path);
    expect(router.use).toHaveBeenCalledWith(
      path,
      swaggerUI.serve,
      swaggerUI.setup({})
    );
  });
});
