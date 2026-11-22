import mongoose from 'mongoose';
import { connectDb } from './db';
import { config } from './config';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { seedCategories, seedProducts } from './data/catalogue';

async function seed() {
  if (!config.mongoUri) {
    console.error('Set MONGODB_URI in backend/.env before seeding.');
    process.exit(1);
  }

  await connectDb();

  const categoryIds = new Map<string, mongoose.Types.ObjectId>();
  for (const category of seedCategories) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { ...category, isActive: true },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    categoryIds.set(category.slug, saved._id);
  }

  for (const product of seedProducts) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) throw new Error(`Missing category ${product.categorySlug}`);
    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: categoryId,
        images: [product.image],
        price: product.price,
        salePrice: product.salePrice,
        variants: product.variants,
        isActive: true,
        showOnHome: true,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${seedCategories.length} categories and ${seedProducts.length} products.`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
