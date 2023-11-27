import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './routes';
import errorHandler from './middleware/errorHandler.middleware';
import { PORT } from './utils/constants';

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

dotenv.config();

if (process.env.DB_URI) {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      app.listen(PORT);
    })
    .catch((err) => {
      console.error(err);
    });
} else {
  throw new Error('DB_URI environment variable is missing');
}
