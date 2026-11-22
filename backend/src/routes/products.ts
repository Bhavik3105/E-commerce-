import { Router } from 'express';
import { Category } from '../models/Category';
import { Product, toPublicProduct, type ProductDoc } from '../models/Product';
import { requireDb } from '../middleware/error';
import type { Types } from 'mongoose';

export const productRouter = Router();

productRouter.get('/', requireDb, async (req, res, next) => {
  try {
    const categorySlug = typeof req.query.category === 'string' ? req.query.category : '';
    const sort = typeof req.query.sort === 'string' ? req.query.sort : '';
    const filter: { isActive: boolean; category?: Types.ObjectId } = { isActive: true };

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug, isActive: true });
      if (!category) {
        res.json({ data: [], page: 1, limit: 0, total: 0, totalPages: 0 });
        return;
      }
      filter.category = category._id;
    }

    const products = await Product.find(filter).populate('category');
    const priced = products.map((product) => product.salePrice && product.salePrice < product.price ? product.salePrice : product.price);

    const ordered = products
      .map((product, index) => ({ product, price: priced[index] }))
      .sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        return 0;
      });

    const data = ordered.map(({ product }) => toPublicProduct(product as ProductDoc & { category: Types.ObjectId }));
    res.json({
      data,
      page: 1,
      limit: data.length,
      total: data.length,
      totalPages: data.length > 0 ? 1 : 0,
    });
  } catch (err) {
    next(err);
  }
});

productRouter.get('/:slug', requireDb, async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ data: toPublicProduct(product as ProductDoc & { category: Types.ObjectId }) });
  } catch (err) {
    next(err);
  }
});
