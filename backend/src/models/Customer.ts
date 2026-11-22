import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    sessionVersion: { type: Number, default: 0 },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export type CustomerDoc = InferSchemaType<typeof customerSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Customer = mongoose.model('Customer', customerSchema);

export function toPublicCustomer(doc: CustomerDoc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
  };
}

export type PublicCustomer = ReturnType<typeof toPublicCustomer>;
