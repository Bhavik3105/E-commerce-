// Shared type definitions for the Jummip e-commerce store

// ─── Product Types ───────────────────────────────────────────────

export interface ProductVariant {
  size: string;
  colour: string;
  colourHex: string;
  stock: number;
  sku?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  images: ProductImage[];
  price: number;        // in paise
  salePrice?: number;   // in paise
  variants: ProductVariant[];
  isActive: boolean;
  showOnHome?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Category Types ──────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

// ─── Cart Types ──────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  size: string;
  colour: string;
  colourHex: string;
  price: number;        // unit price in paise (salePrice or price)
  quantity: number;
  maxStock: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// ─── Order Types ─────────────────────────────────────────────────

export interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  size: string;
  colour: string;
  quantity: number;
  priceAtPurchase: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
export type ShipmentStatus = 'not_shipped' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shipmentStatus: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ──────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

