import dotenv from 'dotenv';

dotenv.config();

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export const config = {
  port: numberFromEnv('PORT', 5000),
  mongoUri: process.env.MONGODB_URI?.trim() ?? '',
  corsOrigin: process.env.CORS_ORIGIN?.trim() || 'http://localhost:3000',
  adminPassword: process.env.ADMIN_PASSWORD?.trim() ?? '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID?.trim() ?? '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET?.trim() ?? '',
  smtpHost: process.env.SMTP_HOST?.trim() ?? '',
  smtpPort: numberFromEnv('SMTP_PORT', 587),
  smtpUser: process.env.SMTP_USER?.trim() ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  mailFrom: process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || '',
  adminEmail: process.env.ADMIN_EMAIL?.trim() || process.env.SMTP_USER?.trim() || '',
  storeUrl: (process.env.STORE_URL?.trim() || process.env.CORS_ORIGIN?.trim() || 'http://localhost:3000').replace(/\/$/, ''),
};
