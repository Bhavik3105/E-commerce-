import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export function adminToken(): string {
  return crypto.createHmac('sha256', config.adminPassword).update('jummip-dashboard').digest('hex');
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!config.adminPassword) {
    res.status(503).json({ message: 'Set ADMIN_PASSWORD in backend/.env before using the dashboard.' });
    return;
  }

  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const expected = adminToken();
  const given = Buffer.from(token);
  const wanted = Buffer.from(expected);

  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
    res.status(401).json({ message: 'Sign in to the dashboard again.' });
    return;
  }

  next();
}
