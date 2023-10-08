import express from 'express';

import router from './routes/index';

import errorHandler from './middleware/errorHandler';

import { PORT } from './utils/constants';

const app = express();

app.use(router);

app.use(errorHandler);

app.listen(PORT);
