import mongoose from 'mongoose';
import { config } from './config';

export async function connectDb(): Promise<boolean> {
  if (!config.mongoUri) return false;
  await mongoose.connect(config.mongoUri);
  return true;
}

export function isDbReady(): boolean {
  return mongoose.connection.readyState === 1;
}
