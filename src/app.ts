import express from 'express';

import router from './routes';
import errorHandler from './middleware/errorHandler.middleware';
import { connectToDatabase } from './utils/database';
import { PORT } from './utils/constants';

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
