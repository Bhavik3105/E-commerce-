import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const variantSchema = new Schema(
  {
    size: { type: String, required: true },
    colour: { type: String, required: true },
    colourHex: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String },
  },
  { _id: false }
);

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: { type: [imageSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    variants: { type: [variantSchema], default: [] },
    isActive: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

productSchema.index({ isActive: 1, category: 1 });

export type ProductDoc = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Product = mongoose.model('Product', productSchema);

type PopulatedCategory = { name?: string; slug?: string };

export function toPublicProduct(doc: ProductDoc & { category: mongoose.Types.ObjectId | PopulatedCategory }) {
  const category = doc.category as PopulatedCategory;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    category: category?.name ?? '',
    categorySlug: category?.slug ?? '',
    images: (doc.images ?? []).map((image) => ({
      id: String((image as { _id?: mongoose.Types.ObjectId })._id ?? image.url),
      url: image.url,
      alt: image.alt,
    })),
    price: doc.price,
    salePrice: doc.salePrice ?? undefined,
    variants: doc.variants ?? [],
    isActive: doc.isActive,
    showOnHome: Boolean(doc.showOnHome),
    seoTitle: doc.seoTitle || undefined,
    seoDescription: doc.seoDescription || undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function unitPrice(doc: { price: number; salePrice?: number | null }): number {
  if (doc.salePrice && doc.salePrice > 0 && doc.salePrice < doc.price) return doc.salePrice;
  return doc.price;
}
