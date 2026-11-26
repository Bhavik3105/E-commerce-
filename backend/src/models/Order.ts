import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { cancelReasonLabel, cancelReasonValues, refundNote } from '../lib/cancel-reasons';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, required: true },
    size: { type: String, required: true },
    colour: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    shipmentStatus: {
      type: String,
      enum: ['not_shipped', 'shipped', 'delivered'],
      default: 'not_shipped',
    },
    cancelReason: {
      type: String,
      enum: cancelReasonValues,
    },
    notes: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    checkoutToken: { type: String },
    stockReleased: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Order = mongoose.model('Order', orderSchema);

export function toPublicOrder(doc: OrderDoc) {
  return {
    id: doc._id.toString(),
    orderNumber: doc.orderNumber,
    customer: doc.customer,
    deliveryAddress: doc.deliveryAddress,
    items: doc.items.map((item) => ({
      productId: item.productId.toString(),
      productName: item.productName,
      productSlug: item.productSlug,
      productImage: item.productImage,
      size: item.size,
      colour: item.colour,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    })),
    subtotal: doc.subtotal,
    shipping: doc.shipping,
    total: doc.total,
    currency: doc.currency,
    paymentStatus: doc.paymentStatus,
    orderStatus: doc.orderStatus,
    shipmentStatus: doc.shipmentStatus,
    cancelReason: doc.cancelReason ?? null,
    cancelReasonLabel: cancelReasonLabel(doc.cancelReason),
    refundNote: doc.orderStatus === 'cancelled' && doc.paymentStatus === 'paid' ? refundNote : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
