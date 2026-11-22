import { Router } from 'express';
import { Category, toPublicCategory } from '../models/Category';
import { requireDb } from '../middleware/error';

export const categoryRouter = Router();

categoryRouter.get('/', requireDb, async (_req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json({ data: categories.map(toPublicCategory) });
  } catch (err) {
    next(err);
  }
});
