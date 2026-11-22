import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { Customer, toPublicCustomer, type PublicCustomer } from '../models/Customer';

const TOKEN_DAYS = 30;

declare global {
  namespace Express {
    interface Request {
      customerAccount?: PublicCustomer;
    }
  }
}

function signingSecret(): string {
  if (!config.adminPassword) {
    throw new Error('ADMIN_PASSWORD is required to sign customer sessions.');
  }
  return crypto.createHmac('sha256', config.adminPassword).update('jummip-customer-session').digest('hex');
}

export function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString('hex')}`);
    });
  });
}

export function passwordMatches(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return Promise.resolve(false);
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      const wanted = Buffer.from(hash, 'hex');
      resolve(key.length === wanted.length && crypto.timingSafeEqual(key, wanted));
    });
  });
}

export function signCustomerToken(customerId: string, sessionVersion = 0): string {
  const body = Buffer.from(
    JSON.stringify({
      id: customerId,
      v: sessionVersion,
      exp: Date.now() + TOKEN_DAYS * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', signingSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function sessionFromToken(token: string): { id: string; version: number } | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', signingSecret()).update(body).digest('base64url');
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as {
      id?: string;
      exp?: number;
      v?: number;
    };
    if (!payload.id || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return { id: payload.id, version: typeof payload.v === 'number' ? payload.v : 0 };
  } catch {
    return null;
  }
}

export async function requireCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.header('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const session = token ? sessionFromToken(token) : null;
    if (!session) {
      res.status(401).json({ message: 'Sign in to continue.' });
      return;
    }
    const customer = await Customer.findById(session.id);
    if (!customer || (customer.sessionVersion ?? 0) !== session.version) {
      res.status(401).json({ message: 'Sign in to continue.' });
      return;
    }
    req.customerAccount = toPublicCustomer(customer);
    next();
  } catch (err) {
    next(err);
  }
}
