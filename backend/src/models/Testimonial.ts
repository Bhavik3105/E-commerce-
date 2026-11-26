import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    collectionName: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export function toPublicTestimonial(doc: TestimonialDoc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    collection: doc.collectionName,
    quote: doc.quote,
  };
}
