import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CategoryDoc = InferSchemaType<typeof categorySchema> & { _id: mongoose.Types.ObjectId };

export const Category = mongoose.model('Category', categorySchema);

export function toPublicCategory(doc: {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
}) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    image: doc.image || undefined,
    isActive: doc.isActive,
    sortOrder: doc.sortOrder,
  };
}
