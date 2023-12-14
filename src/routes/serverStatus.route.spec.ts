import serverStatusRouter from './serverStatus.route';

import serverStatusCheck from '../controllers/serverStatus.controller';
import { routes } from '../utils/constants';

describe('serverStatus router', () => {
  it('should call GET method with serverStatus path and serverStatusCheck handler', () => {
    expect(serverStatusRouter.get).toHaveBeenCalledWith(
      routes.serverStatus,
      serverStatusCheck
    );
  });
});
