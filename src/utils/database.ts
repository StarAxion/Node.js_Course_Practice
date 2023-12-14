import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { NO_DB_URI } from './constants';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectToDatabase = async (): Promise<void> => {
  dotenv.config();
  try {
    let dbUri = process.env.DB_URI;
    if (process.env.NODE_ENV === 'test') {
      mongoMemoryServer = await MongoMemoryServer.create();
      dbUri = mongoMemoryServer.getUri();
    }
    if (dbUri) {
      await mongoose.connect(dbUri);
      console.log('Successfully connected to the database');
    } else {
      throw new Error(NO_DB_URI);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Successfully disconnected from the database');
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
