import crypto from 'crypto';
import { config } from '../config';

export function razorpayConfigured(): boolean {
  return Boolean(config.razorpayKeyId && config.razorpayKeySecret);
}

export class RazorpayError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function createRazorpayOrder(amount: number, receipt: string): Promise<{ id: string; amount: number; currency: string }> {
  if (!Number.isInteger(amount) || amount < 100) {
    throw new RazorpayError('The order total must be at least ₹1.', 400);
  }
  const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency: 'INR', receipt }),
  });
  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    amount?: number;
    currency?: string;
    error?: { description?: string };
  };
  if (response.status === 401) {
    throw new RazorpayError('Razorpay rejected the API keys.', 401);
  }
  if (!response.ok || !body.id || body.amount !== amount) {
    throw new RazorpayError(body.error?.description || 'Razorpay could not start this payment.', 500);
  }
  return { id: body.id, amount: body.amount, currency: body.currency || 'INR' };
}

export function paymentSignatureMatches(orderId: string, paymentId: string, signature: string): boolean {
  const expected = crypto.createHmac('sha256', config.razorpayKeySecret).update(`${orderId}|${paymentId}`).digest('hex');
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}
