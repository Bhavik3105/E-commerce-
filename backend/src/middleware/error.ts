import type { NextFunction, Request, Response } from 'express';
import { isDbReady } from '../db';

export function requireDb(_req: Request, res: Response, next: NextFunction): void {
  if (!isDbReady()) {
    res.status(503).json({
      message: 'Database is not connected. Add MONGODB_URI to backend/.env and restart the API.',
    });
    return;
  }
  next();
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Not found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
}
