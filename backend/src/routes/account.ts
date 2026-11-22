import crypto from 'crypto';
import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config';
import { Customer, toPublicCustomer, type CustomerDoc } from '../models/Customer';
import { Order, toPublicOrder } from '../models/Order';
import { requireDb } from '../middleware/error';
import { hashPassword, passwordMatches, requireCustomer, signCustomerToken } from '../lib/customer-auth';
import { mailConfigured, sendPasswordResetEmail } from '../lib/mail';

const credentials = {
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'),
  password: z.string().min(8).max(72),
};

const registerSchema = z.object(credentials);
const loginSchema = z.object({
  email: credentials.email,
  password: credentials.password,
});

const resetNotice = 'If an account exists for that email, a reset link is on its way. It expires in 30 minutes.';
const resetWindowMs = 15 * 60 * 1000;
const resetHits = new Map<string, number[]>();

function session(doc: CustomerDoc) {
  const data = toPublicCustomer(doc);
  return { token: signCustomerToken(data.id, doc.sessionVersion ?? 0), data };
}

function tooManyResets(key: string): boolean {
  const now = Date.now();
  const recent = (resetHits.get(key) ?? []).filter((time) => now - time < resetWindowMs);
  if (recent.length >= 5) {
    resetHits.set(key, recent);
    return true;
  }
  recent.push(now);
  resetHits.set(key, recent);
  return false;
}

function tokenHash(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function linkPastOrders(customer: CustomerDoc): Promise<void> {
  const email = customer.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await Order.updateMany(
    {
      $or: [{ customerId: null }, { customerId: { $exists: false } }],
      'customer.phone': customer.phone,
      'customer.email': { $regex: `^${email}$`, $options: 'i' },
    },
    { $set: { customerId: customer._id } }
  );
}

export const accountRouter = Router();

accountRouter.post('/register', requireDb, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path.join('.') || 'body'] = issue.message;
      }
      res.status(400).json({ message: 'Check the account details.', errors });
      return;
    }
    const email = parsed.data.email.toLowerCase();
    const existing = await Customer.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists. Sign in instead.' });
      return;
    }
    const customer = await Customer.create({
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
    });
    await linkPastOrders(customer);
    res.status(201).json(session(customer));
  } catch (err) {
    const code = typeof err === 'object' && err && 'code' in err ? (err as { code?: number }).code : undefined;
    if (code === 11000) {
      res.status(409).json({ message: 'An account with this email already exists. Sign in instead.' });
      return;
    }
    next(err);
  }
});

accountRouter.post('/login', requireDb, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Enter the email and password for your account.' });
      return;
    }
    const customer = await Customer.findOne({ email: parsed.data.email.toLowerCase() });
    const matches = customer ? await passwordMatches(parsed.data.password, customer.passwordHash) : false;
    if (!customer || !matches) {
      if (!customer) await hashPassword(parsed.data.password);
      res.status(401).json({ message: 'Email or password is incorrect.' });
      return;
    }
    await linkPastOrders(customer);
    res.json(session(customer));
  } catch (err) {
    next(err);
  }
});

accountRouter.post('/forgot-password', requireDb, async (req, res, next) => {
  try {
    const parsed = z.object({ email: credentials.email }).safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Enter the email on your account.' });
      return;
    }
    const ip = req.ip || 'unknown';
    if (tooManyResets(ip)) {
      res.status(429).json({ message: 'Please wait a few minutes before requesting another reset link.' });
      return;
    }
    if (!mailConfigured()) {
      res.status(503).json({ message: 'Password reset email is not set up yet. Contact the store.' });
      return;
    }
    const customer = await Customer.findOne({ email: parsed.data.email.toLowerCase() });
    if (!customer) {
      res.json({ message: resetNotice });
      return;
    }
    const token = crypto.randomBytes(32).toString('base64url');
    customer.resetTokenHash = tokenHash(token);
    customer.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
    await customer.save();
    try {
      await sendPasswordResetEmail({
        to: customer.email,
        name: customer.name,
        resetUrl: `${config.storeUrl}/reset-password?token=${encodeURIComponent(token)}`,
      });
    } catch (err) {
      console.error('Password reset email failed');
      await Customer.updateOne({ _id: customer._id }, { $unset: { resetTokenHash: 1, resetTokenExpires: 1 } });
      res.status(500).json({ message: 'The reset email could not be sent. Try again in a few minutes.' });
      return;
    }
    res.json({ message: resetNotice });
  } catch (err) {
    next(err);
  }
});

accountRouter.post('/reset-password', requireDb, async (req, res, next) => {
  try {
    const parsed = z
      .object({
        token: z.string().min(20).max(200),
        password: credentials.password,
      })
      .safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Choose a password of at least 8 characters.' });
      return;
    }
    const customer = await Customer.findOne({
      resetTokenHash: tokenHash(parsed.data.token),
      resetTokenExpires: { $gt: new Date() },
    });
    if (!customer) {
      res.status(400).json({ message: 'This reset link is invalid or has expired. Request a new one.' });
      return;
    }
    const sessionVersion = (customer.sessionVersion ?? 0) + 1;
    customer.passwordHash = await hashPassword(parsed.data.password);
    customer.sessionVersion = sessionVersion;
    customer.resetTokenHash = undefined;
    customer.resetTokenExpires = undefined;
    await Customer.updateOne(
      { _id: customer._id },
      {
        $set: { passwordHash: customer.passwordHash, sessionVersion },
        $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
      }
    );
    res.json(session(customer));
  } catch (err) {
    next(err);
  }
});

accountRouter.get('/me', requireDb, requireCustomer, (req, res) => {
  res.json({ data: req.customerAccount });
});

accountRouter.get('/orders', requireDb, requireCustomer, async (req, res, next) => {
  try {
    const orders = await Order.find({
      customerId: req.customerAccount?.id,
      paymentStatus: 'paid',
    }).sort({ createdAt: -1 });
    res.json({ data: orders.map((order) => toPublicOrder(order)) });
  } catch (err) {
    next(err);
  }
});
