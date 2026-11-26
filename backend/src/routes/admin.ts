import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { config } from '../config';
import { adminToken, requireAdmin } from '../lib/admin-auth';
import { photoUpload } from '../lib/upload';
import { requireDb } from '../middleware/error';
import { Category, toPublicCategory } from '../models/Category';
import { Testimonial, toPublicTestimonial } from '../models/Testimonial';
import { Reel, toPublicReel } from '../models/Reel';
import { instagramReelCode } from '../lib/instagram-reel';
import { Order, toPublicOrder, type OrderDoc } from '../models/Order';
import { Product, toPublicProduct, type ProductDoc } from '../models/Product';
import { cancelReasonLabel, cancelReasonValues, refundNote } from '../lib/cancel-reasons';
import { mailConfigured, sendOrderCancelledEmail, sendOrderStatusEmail } from '../lib/mail';
import type { Types } from 'mongoose';

const variantSchema = z.object({
  size: z.string().trim().min(1).max(12),
  colour: z.string().trim().min(1).max(40),
  colourHex: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/),
  stock: z.number().int().min(0).max(10000),
});

const productBody = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(800),
  categorySlug: z.string().trim().min(1).max(60),
  priceRupees: z.number().positive().max(100000),
  salePriceRupees: z.number().positive().max(100000).nullable().optional(),
  imageUrl: z.string().trim().url().max(500),
  showOnHome: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1).max(40),
});

function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'product';
}

async function uniqueSlug(name: string, currentId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (await Product.exists({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export const adminRouter = Router();

const shipmentBody = z.object({
  shipmentStatus: z.enum(['not_shipped', 'shipped', 'delivered']),
});

adminRouter.get('/orders', requireAdmin, requireDb, async (_req, res, next) => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' }).sort({ createdAt: -1 }).limit(100);
    res.json({ data: orders.map((order) => toPublicOrder(order)) });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/orders/:orderNumber', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = shipmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Choose a delivery status.' });
      return;
    }
    const orderNumber = Array.isArray(req.params.orderNumber) ? req.params.orderNumber[0] : req.params.orderNumber;
    const order = await Order.findOne({ orderNumber, paymentStatus: 'paid' });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.orderStatus === 'cancelled') {
      res.status(409).json({ message: 'This order is cancelled.' });
      return;
    }
    const changed = order.shipmentStatus !== parsed.data.shipmentStatus;
    order.shipmentStatus = parsed.data.shipmentStatus;
    order.orderStatus =
      parsed.data.shipmentStatus === 'delivered'
        ? 'completed'
        : parsed.data.shipmentStatus === 'shipped'
          ? 'processing'
          : 'confirmed';
    await order.save();
    let emailed = false;
    if (changed && mailConfigured()) {
      try {
        await sendOrderStatusEmail(toPublicOrder(order));
        emailed = true;
      } catch (err) {
        console.error('Order status email failed');
      }
    }
    res.json({ data: toPublicOrder(order), emailed });
  } catch (err) {
    next(err);
  }
});

const cancelBody = z.object({
  reason: z.enum(cancelReasonValues),
});

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

adminRouter.post('/orders/:orderNumber/cancel', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = cancelBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Choose why this order is being cancelled.' });
      return;
    }
    const orderNumber = Array.isArray(req.params.orderNumber) ? req.params.orderNumber[0] : req.params.orderNumber;
    const order = await Order.findOne({ orderNumber, paymentStatus: 'paid' });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.orderStatus === 'cancelled') {
      res.status(409).json({ message: 'This order is already cancelled.' });
      return;
    }
    const reason = cancelReasonLabel(parsed.data.reason);
    if (!reason) {
      res.status(400).json({ message: 'Choose why this order is being cancelled.' });
      return;
    }
    await releaseStock(order);
    order.orderStatus = 'cancelled';
    order.cancelReason = parsed.data.reason;
    await order.save();
    let emailed = false;
    if (mailConfigured()) {
      try {
        await sendOrderCancelledEmail(toPublicOrder(order), reason);
        emailed = true;
      } catch (err) {
        console.error('Order cancellation email failed');
      }
    }
    res.json({ data: toPublicOrder(order), emailed, refundNote });
  } catch (err) {
    next(err);
  }
});

const collectionBody = z.object({
  name: z.string().trim().min(2).max(40),
  description: z.string().trim().min(10).max(300),
  imageUrl: z.string().trim().url().max(500),
});

const reservedSlugs = new Set([
  'home',
  'shop',
  'products',
  'admin',
  'cart',
  'checkout',
  'category',
  'contact',
  'about',
  'blog',
  'login',
  'account',
  'order',
  'orders',
  'forgot-password',
  'reset-password',
  'testimonials',
  'reels',
]);

adminRouter.post('/categories', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = collectionBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the collection details', errors: issues(parsed.error.issues) });
      return;
    }

    const slug = await uniqueCategorySlug(parsed.data.name);
    const sortOrder = (await Category.countDocuments()) + 1;
    const saved = await Category.create({
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      image: parsed.data.imageUrl,
      isActive: true,
      sortOrder,
    });
    res.status(201).json({ data: toPublicCategory(saved) });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/categories/:slug', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = collectionBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the collection details', errors: issues(parsed.error.issues) });
      return;
    }
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const category = await Category.findOne({ slug });
    if (!category) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    category.name = parsed.data.name;
    category.description = parsed.data.description;
    category.image = parsed.data.imageUrl;
    await category.save();
    res.json({ data: toPublicCategory(category) });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/categories/:slug', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const category = await Category.findOne({ slug });
    if (!category) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    const removed = await Product.deleteMany({ category: category._id });
    await category.deleteOne();
    res.json({ deletedProducts: removed.deletedCount });
  } catch (err) {
    next(err);
  }
});

async function uniqueCategorySlug(name: string): Promise<string> {
  let slug = slugify(name);
  if (reservedSlugs.has(slug)) slug = `${slug}-collection`;
  let n = 2;
  let candidate = slug;
  while (await Category.exists({ slug: candidate })) {
    candidate = `${slug}-${n}`;
    n += 1;
  }
  return candidate;
}

adminRouter.post('/uploads', requireAdmin, (req, res) => {
  photoUpload.single('photo')(req, res, (err: unknown) => {
    if (err) {
      const tooLarge = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE';
      const message = tooLarge
        ? 'That photo is larger than 5 MB.'
        : err instanceof Error
          ? err.message
          : 'Could not upload the photo';
      res.status(400).json({ message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: 'Choose a JPG, PNG, or WEBP photo.' });
      return;
    }
    res.status(201).json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
  });
});

adminRouter.post('/login', (req, res) => {
  if (!config.adminPassword) {
    res.status(503).json({ message: 'Set ADMIN_PASSWORD in backend/.env before using the dashboard.' });
    return;
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password !== config.adminPassword) {
    res.status(401).json({ message: 'That password is not correct.' });
    return;
  }
  res.json({ token: adminToken() });
});

adminRouter.get('/products', requireAdmin, requireDb, async (_req, res, next) => {
  try {
    const products = await Product.find().populate('category').sort({ updatedAt: -1 });
    res.json({
      data: products.map((product) => toPublicProduct(product as ProductDoc & { category: Types.ObjectId })),
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/products', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = productBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the product details', errors: issues(parsed.error.issues) });
      return;
    }
    const saved = await saveProduct(parsed.data);
    if (saved === 'missing-category') {
      res.status(400).json({ message: 'Choose a collection that exists.' });
      return;
    }
    if (!saved) {
      res.status(400).json({ message: 'The sale price must be lower than the regular price.' });
      return;
    }
    const populated = await Product.findById(saved._id).populate('category');
    res.status(201).json({ data: toPublicProduct(populated as ProductDoc & { category: Types.ObjectId }) });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/products/:id', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = productBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the product details', errors: issues(parsed.error.issues) });
      return;
    }
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const saved = await saveProduct(parsed.data, existing._id.toString());
    if (saved === 'missing-category') {
      res.status(400).json({ message: 'Choose a collection that exists.' });
      return;
    }
    if (!saved) {
      res.status(400).json({ message: 'The sale price must be lower than the regular price.' });
      return;
    }
    const populated = await Product.findById(existing._id).populate('category');
    res.json({ data: toPublicProduct(populated as ProductDoc & { category: Types.ObjectId }) });
  } catch (err) {
    next(err);
  }
});

const testimonialBody = z.object({
  name: z.string().trim().min(2).max(60),
  collection: z.string().trim().min(2).max(40),
  quote: z.string().trim().min(10).max(400),
});

adminRouter.get('/testimonials', requireAdmin, requireDb, async (_req, res, next) => {
  try {
    const notes = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ data: notes.map((note) => toPublicTestimonial(note)) });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/testimonials', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = testimonialBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the testimonial', errors: issues(parsed.error.issues) });
      return;
    }
    const saved = await Testimonial.create({
      name: parsed.data.name,
      collectionName: parsed.data.collection,
      quote: parsed.data.quote,
    });
    res.status(201).json({ data: toPublicTestimonial(saved) });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/testimonials/:id', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = testimonialBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Check the testimonial', errors: issues(parsed.error.issues) });
      return;
    }
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const note = await Testimonial.findById(id);
    if (!note) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }
    note.name = parsed.data.name;
    note.collectionName = parsed.data.collection;
    note.quote = parsed.data.quote;
    await note.save();
    res.json({ data: toPublicTestimonial(note) });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/testimonials/:id', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

const reelBody = z.object({
  url: z.string().trim().url().max(500),
});

adminRouter.get('/reels', requireAdmin, requireDb, async (_req, res, next) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json({ data: reels.map((reel) => toPublicReel(reel)) });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/reels', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const parsed = reelBody.safeParse(req.body);
    const code = parsed.success ? instagramReelCode(parsed.data.url) : null;
    if (!parsed.success || !code) {
      res.status(400).json({ message: 'Paste an Instagram reel link, like https://www.instagram.com/reel/...' });
      return;
    }
    if (await Reel.exists({ code })) {
      res.status(409).json({ message: 'This reel is already on the homepage.' });
      return;
    }
    if ((await Reel.countDocuments()) >= 12) {
      res.status(400).json({ message: 'The homepage can show 12 reels. Remove one before adding another.' });
      return;
    }
    const saved = await Reel.create({
      url: `https://www.instagram.com/reel/${code}/`,
      code,
    });
    res.status(201).json({ data: toPublicReel(saved) });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/reels/:id', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await Reel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Reel not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/products/:id', requireAdmin, requireDb, async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

function issues(list: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of list) {
    errors[issue.path.join('.') || 'body'] = issue.message;
  }
  return errors;
}

async function saveProduct(input: z.infer<typeof productBody>, currentId?: string) {
  const category = await Category.findOne({ slug: input.categorySlug, isActive: true });
  if (!category) return 'missing-category' as const;

  const price = rupeesToPaise(input.priceRupees);
  const enteredSale = input.salePriceRupees ? rupeesToPaise(input.salePriceRupees) : null;
  if (enteredSale && enteredSale > price) return null;
  const salePrice = enteredSale && enteredSale < price ? enteredSale : null;

  const payload = {
    name: input.name,
    slug: currentId ? (await Product.findById(currentId))?.slug ?? (await uniqueSlug(input.name, currentId)) : await uniqueSlug(input.name),
    description: input.description,
    category: category._id,
    images: [{ url: input.imageUrl, alt: input.name }],
    price,
    salePrice: salePrice ?? undefined,
    variants: input.variants,
    isActive: input.isActive,
    showOnHome: input.showOnHome && input.isActive,
  };

  if (!currentId) return Product.create(payload);

  const updated = await Product.findByIdAndUpdate(
    currentId,
    salePrice ? { $set: payload } : { $set: { ...payload, salePrice: undefined }, $unset: { salePrice: 1 } },
    { returnDocument: 'after' }
  );
  if (!updated) throw new Error('Product not found');
  return updated;
}
