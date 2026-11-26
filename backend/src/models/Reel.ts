import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const reelSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export type ReelDoc = InferSchemaType<typeof reelSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Reel = mongoose.model('Reel', reelSchema);

export function toPublicReel(doc: ReelDoc) {
  return {
    id: doc._id.toString(),
    url: doc.url,
    code: doc.code,
  };
}
