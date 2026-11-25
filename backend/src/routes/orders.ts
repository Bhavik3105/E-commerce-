import crypto from 'crypto';
import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { config } from '../config';
import { Order, toPublicOrder, type OrderDoc } from '../models/Order';
import { Product, unitPrice, type ProductDoc } from '../models/Product';
import { requireDb } from '../middleware/error';
import { shippingFor } from '../lib/shipping';
import { RazorpayError, createRazorpayOrder, paymentSignatureMatches, razorpayConfigured } from '../lib/razorpay';
import { mailConfigured, sendAdminOrderEmail, sendOrderPlacedEmail } from '../lib/mail';
import { requireCustomer } from '../lib/customer-auth';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().trim().min(1),
  colour: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
});

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'),
  }),
  deliveryAddress: z.object({
    line1: z.string().trim().min(3).max(160),
    line2: z.string().trim().max(160).optional(),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a 6-digit PIN code'),
  }),
  items: z.array(orderItemSchema).min(1).max(30),
  notes: z.string().trim().max(300).optional(),
});

const paymentSchema = z.object({
  checkoutToken: z.string().min(16),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

function tokensMatch(stored: string, given: string): boolean {
  const left = Buffer.from(stored);
  const right = Buffer.from(given);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

async function releaseStock(order: OrderDoc): Promise<void> {
  if (order.stockReleased) return;
  for (const item of order.items) {
    await Product.updateOne(
      {
        _id: item.productId,
        variants: { $elemMatch: { size: item.size, colour: item.colour } },
      },
      { $inc: { 'variants.$.stock': item.quantity } }
    );
  }
  order.stockReleased = true;
}

function orderNumber(): string {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `JMP-${day}-${suffix}`;
}

export const orderRouter = Router();

orderRouter.get('/:orderNumber', requireDb, requireCustomer, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    const ownerId = order?.customerId?.toString();
    if (!order || !ownerId || ownerId !== req.customerAccount?.id) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json({ data: toPublicOrder(order) });
  } catch (err) {
    next(err);
  }
});

orderRouter.post('/:orderNumber/payment', requireDb, async (req, res, next) => {
  try {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Payment details are incomplete.' });
      return;
    }
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order || !order.checkoutToken || !tokensMatch(order.checkoutToken, parsed.data.checkoutToken)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.paymentStatus === 'paid') {
      res.json({ data: toPublicOrder(order) });
      return;
    }
    if (order.orderStatus === 'cancelled' || order.stockReleased) {
      res.status(409).json({ message: 'This order is no longer waiting for payment.' });
      return;
    }
    if (
      order.razorpayOrderId !== parsed.data.razorpayOrderId ||
      !paymentSignatureMatches(parsed.data.razorpayOrderId, parsed.data.razorpayPaymentId, parsed.data.razorpaySignature)
    ) {
      res.status(400).json({ message: 'The payment could not be verified.' });
      return;
    }
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = parsed.data.razorpayPaymentId;
    await order.save();
    if (mailConfigured()) {
      const mailed = toPublicOrder(order);
      try {
        await sendOrderPlacedEmail(mailed);
      } catch (err) {
        console.error('Order confirmation email failed');
      }
      try {
        await sendAdminOrderEmail(mailed);
      } catch (err) {
        console.error('Admin order email failed');
      }
    }
    res.json({ data: toPublicOrder(order) });
  } catch (err) {
    next(err);
  }
});

orderRouter.post('/:orderNumber/cancel', requireDb, async (req, res, next) => {
  try {
    const token = typeof req.body?.checkoutToken === 'string' ? req.body.checkoutToken : '';
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order || !order.checkoutToken || !token || !tokensMatch(order.checkoutToken, token)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.paymentStatus === 'paid') {
      res.json({ data: toPublicOrder(order) });
      return;
    }
    if (!order.stockReleased) {
      await releaseStock(order);
    }
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    await order.save();
    res.json({ data: toPublicOrder(order) });
  } catch (err) {
    next(err);
  }
});

orderRouter.post('/', requireDb, requireCustomer, async (req, res, next) => {
  try {
    if (!razorpayConfigured()) {
      res.status(503).json({ message: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env before taking payment.' });
      return;
    }
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path.join('.') || 'body'] = issue.message;
      }
      res.status(400).json({ message: 'Check the order details', errors });
      return;
    }

    const input = parsed.data;
    const account = req.customerAccount;
    if (!account) {
      res.status(401).json({ message: 'Sign in to continue.' });
      return;
    }
    const ids = [...new Set(input.items.map((item) => item.productId))];
    if (ids.some((id) => !mongoose.isValidObjectId(id))) {
      res.status(400).json({ message: 'One of the products is not valid' });
      return;
    }

    const products = await Product.find({
      _id: { $in: ids },
      isActive: true,
    });
    const byId = new Map(products.map((product) => [product._id.toString(), product]));

    const lines: Array<{
      product: ProductDoc;
      size: string;
      colour: string;
      quantity: number;
      priceAtPurchase: number;
    }> = [];

    for (const item of input.items) {
      const product = byId.get(item.productId);
      if (!product) {
        res.status(400).json({ message: 'A product in this order is no longer available' });
        return;
      }
      const variant = product.variants.find((entry) => entry.size === item.size && entry.colour === item.colour);
      if (!variant) {
        res.status(400).json({ message: `${product.name} is not available in ${item.size} / ${item.colour}` });
        return;
      }
      const already = lines
        .filter((line) => line.product._id.equals(product._id) && line.size === item.size && line.colour === item.colour)
        .reduce((sum, line) => sum + line.quantity, 0);
      if (variant.stock < item.quantity + already) {
        res.status(409).json({ message: `${product.name} does not have enough stock in ${item.size} / ${item.colour}` });
        return;
      }
      lines.push({
        product,
        size: item.size,
        colour: item.colour,
        quantity: item.quantity,
        priceAtPurchase: unitPrice(product),
      });
    }

    const subtotal = lines.reduce((sum, line) => sum + line.priceAtPurchase * line.quantity, 0);
    const shipping = shippingFor(subtotal);
    const total = subtotal + shipping;
    if (total < 100) {
      res.status(400).json({ message: 'The order total must be at least ₹1.' });
      return;
    }

    const session = await mongoose.startSession();
    try {
      let createdId: mongoose.Types.ObjectId | null = null;

      await session.withTransaction(async () => {
        for (const line of lines) {
          const updated = await Product.updateOne(
            {
              _id: line.product._id,
              variants: {
                $elemMatch: { size: line.size, colour: line.colour, stock: { $gte: line.quantity } },
              },
            },
            { $inc: { 'variants.$.stock': -line.quantity } },
            { session }
          );
          if (updated.modifiedCount !== 1) {
            throw new Error('STOCK');
          }
        }

        const [order] = await Order.create(
          [
            {
              orderNumber: orderNumber(),
              customerId: account.id,
              customer: {
                name: input.customer.name,
                email: account.email,
                phone: input.customer.phone,
              },
              deliveryAddress: input.deliveryAddress,
              items: lines.map((line) => ({
                productId: line.product._id,
                productName: line.product.name,
                productSlug: line.product.slug,
                productImage: line.product.images[0]?.url ?? '',
                size: line.size,
                colour: line.colour,
                quantity: line.quantity,
                priceAtPurchase: line.priceAtPurchase,
              })),
              subtotal,
              shipping,
              total,
              notes: input.notes,
              checkoutToken: crypto.randomBytes(24).toString('hex'),
            },
          ],
          { session }
        );
        createdId = order._id;
      });

      const saved = createdId ? await Order.findById(createdId) : null;
      if (!saved || !saved.checkoutToken) {
        res.status(500).json({ message: 'The order could not be saved' });
        return;
      }

      let razorpayOrder: { id: string; amount: number; currency: string };
      try {
        razorpayOrder = await createRazorpayOrder(saved.total, saved.orderNumber);
      } catch (err) {
        await releaseStock(saved);
        saved.paymentStatus = 'failed';
        saved.orderStatus = 'cancelled';
        await saved.save();
        res.status(err instanceof RazorpayError ? err.status : 500).json({
          message: err instanceof Error ? err.message : 'Payment could not be started. Nothing was charged.',
        });
        return;
      }

      saved.razorpayOrderId = razorpayOrder.id;
      await saved.save();
      res.status(201).json({
        data: toPublicOrder(saved),
        payment: {
          keyId: config.razorpayKeyId,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          checkoutToken: saved.checkoutToken,
        },
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'STOCK') {
        res.status(409).json({ message: 'Stock changed while the order was being placed. Please try again.' });
        return;
      }
      const code = typeof err === 'object' && err && 'code' in err ? (err as { code?: number }).code : undefined;
      if (code === 20 || (err instanceof Error && /replica set/i.test(err.message))) {
        res.status(503).json({
          message: 'Orders need a MongoDB replica set. Atlas clusters support this. A standalone local database does not.',
        });
        return;
      }
      throw err;
    } finally {
      await session.endSession();
    }
  } catch (err) {
    next(err);
  }
});
