import { Router } from 'express';
import { isDbReady } from '../db';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'jummip-api',
    database: isDbReady() ? 'connected' : 'not_connected',
  });
});
