import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Cotton Shirt',
    slug: 'classic-cotton-shirt',
    description:
      'A timeless cotton shirt crafted from premium breathable fabric. Perfect for both formal occasions and smart-casual outings. Features a regular fit with a button-down collar and single chest pocket.',
    category: "Men's Wear",
    categorySlug: 'mens-wear',
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop', alt: 'Classic cotton shirt front view' },
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600&h=800&fit=crop', alt: 'Classic cotton shirt side view' },
    ],
    price: 149900,
    salePrice: 119900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 10, sku: 'CCS-WHT-S' },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 15, sku: 'CCS-WHT-M' },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 12, sku: 'CCS-WHT-L' },
      { size: 'XL', colour: 'White', colourHex: '#FFFFFF', stock: 8, sku: 'CCS-WHT-XL' },
      { size: 'S', colour: 'Sky Blue', colourHex: '#87CEEB', stock: 8, sku: 'CCS-BLU-S' },
      { size: 'M', colour: 'Sky Blue', colourHex: '#87CEEB', stock: 10, sku: 'CCS-BLU-M' },
      { size: 'L', colour: 'Sky Blue', colourHex: '#87CEEB', stock: 6, sku: 'CCS-BLU-L' },
      { size: 'XL', colour: 'Sky Blue', colourHex: '#87CEEB', stock: 4, sku: 'CCS-BLU-XL' },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 5, sku: 'CCS-BLK-M' },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 7, sku: 'CCS-BLK-L' },
    ],
    isActive: true,
    seoTitle: 'Classic Cotton Shirt | Jummip',
    seoDescription: 'Premium breathable cotton shirt for men. Available in White, Sky Blue and Black.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Slim Fit Chinos',
    slug: 'slim-fit-chinos',
    description:
      'Modern slim-fit chinos made from stretch cotton blend. Comfortable for all-day wear with a clean tailored look. Features slant front pockets and welt back pockets.',
    category: "Men's Wear",
    categorySlug: 'mens-wear',
    images: [
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', alt: 'Slim fit chinos front' },
    ],
    price: 179900,
    variants: [
      { size: '30', colour: 'Khaki', colourHex: '#C3B091', stock: 10 },
      { size: '32', colour: 'Khaki', colourHex: '#C3B091', stock: 12 },
      { size: '34', colour: 'Khaki', colourHex: '#C3B091', stock: 8 },
      { size: '36', colour: 'Khaki', colourHex: '#C3B091', stock: 5 },
      { size: '30', colour: 'Navy', colourHex: '#1B2A4A', stock: 7 },
      { size: '32', colour: 'Navy', colourHex: '#1B2A4A', stock: 9 },
      { size: '34', colour: 'Navy', colourHex: '#1B2A4A', stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Floral Embroidered Kurti',
    slug: 'floral-embroidered-kurti',
    description:
      'Beautifully embroidered kurti with floral patterns. Made from soft cotton fabric with three-quarter sleeves and a flattering A-line silhouette. Perfect for festive and casual occasions.',
    category: "Women's Wear",
    categorySlug: 'womens-wear',
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop', alt: 'Floral embroidered kurti' },
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop', alt: 'Kurti detail view' },
    ],
    price: 199900,
    salePrice: 159900,
    variants: [
      { size: 'S', colour: 'Maroon', colourHex: '#800000', stock: 6 },
      { size: 'M', colour: 'Maroon', colourHex: '#800000', stock: 10 },
      { size: 'L', colour: 'Maroon', colourHex: '#800000', stock: 8 },
      { size: 'XL', colour: 'Maroon', colourHex: '#800000', stock: 4 },
      { size: 'S', colour: 'Teal', colourHex: '#008080', stock: 5 },
      { size: 'M', colour: 'Teal', colourHex: '#008080', stock: 7 },
      { size: 'L', colour: 'Teal', colourHex: '#008080', stock: 9 },
    ],
    isActive: true,
    seoTitle: 'Floral Embroidered Kurti | Jummip',
    seoDescription: 'Soft cotton kurti with floral embroidery. Available in Maroon and Teal.',
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Printed Wrap Dress',
    slug: 'printed-wrap-dress',
    description:
      'Elegant printed wrap dress with a flowing silhouette. Features a V-neckline, tie waist and ruffled hem. Made from lightweight georgette fabric.',
    category: "Women's Wear",
    categorySlug: 'womens-wear',
    images: [
      { id: 'img-6', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Printed wrap dress' },
    ],
    price: 249900,
    variants: [
      { size: 'S', colour: 'Dusty Rose', colourHex: '#DCAE96', stock: 4 },
      { size: 'M', colour: 'Dusty Rose', colourHex: '#DCAE96', stock: 6 },
      { size: 'L', colour: 'Dusty Rose', colourHex: '#DCAE96', stock: 5 },
      { size: 'S', colour: 'Navy Floral', colourHex: '#1B2A4A', stock: 3 },
      { size: 'M', colour: 'Navy Floral', colourHex: '#1B2A4A', stock: 5 },
      { size: 'L', colour: 'Navy Floral', colourHex: '#1B2A4A', stock: 4 },
    ],
    isActive: true,
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Kids Graphic T-Shirt',
    slug: 'kids-graphic-tshirt',
    description:
      'Fun and colourful graphic t-shirt for kids. Made from 100% soft cotton for all-day comfort. Features a playful printed design on the front.',
    category: "Kids' Wear",
    categorySlug: 'kids-wear',
    images: [
      { id: 'img-7', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop', alt: 'Kids graphic t-shirt' },
    ],
    price: 79900,
    salePrice: 59900,
    variants: [
      { size: '4-5Y', colour: 'Yellow', colourHex: '#FFD700', stock: 15 },
      { size: '6-7Y', colour: 'Yellow', colourHex: '#FFD700', stock: 12 },
      { size: '8-9Y', colour: 'Yellow', colourHex: '#FFD700', stock: 10 },
      { size: '4-5Y', colour: 'Red', colourHex: '#DC3545', stock: 8 },
      { size: '6-7Y', colour: 'Red', colourHex: '#DC3545', stock: 10 },
      { size: '8-9Y', colour: 'Red', colourHex: '#DC3545', stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Casual Crew Neck T-Shirt',
    slug: 'casual-crew-neck-tshirt',
    description:
      'Essential everyday crew neck t-shirt. Premium combed cotton for a soft feel. Regular fit with reinforced collar and double-stitched hems.',
    category: "Men's Wear",
    categorySlug: 'mens-wear',
    images: [
      { id: 'img-8', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', alt: 'Crew neck t-shirt' },
    ],
    price: 89900,
    variants: [
      { size: 'S', colour: 'Charcoal', colourHex: '#36454F', stock: 20 },
      { size: 'M', colour: 'Charcoal', colourHex: '#36454F', stock: 25 },
      { size: 'L', colour: 'Charcoal', colourHex: '#36454F', stock: 18 },
      { size: 'XL', colour: 'Charcoal', colourHex: '#36454F', stock: 10 },
      { size: 'S', colour: 'Olive', colourHex: '#556B2F', stock: 12 },
      { size: 'M', colour: 'Olive', colourHex: '#556B2F', stock: 15 },
      { size: 'L', colour: 'Olive', colourHex: '#556B2F', stock: 10 },
      { size: 'XL', colour: 'Olive', colourHex: '#556B2F', stock: 8 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 20 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 15 },
    ],
    isActive: true,
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Cotton Palazzo Pants',
    slug: 'cotton-palazzo-pants',
    description:
      'Comfortable wide-leg palazzo pants in soft cotton. Elasticated waistband for easy fit. Perfect for pairing with kurtis and tops.',
    category: "Women's Wear",
    categorySlug: 'womens-wear',
    images: [
      { id: 'img-9', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', alt: 'Cotton palazzo pants' },
    ],
    price: 129900,
    variants: [
      { size: 'S', colour: 'Black', colourHex: '#222222', stock: 10 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 12 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 8 },
      { size: 'XL', colour: 'Black', colourHex: '#222222', stock: 5 },
      { size: 'M', colour: 'Beige', colourHex: '#F5F5DC', stock: 10 },
      { size: 'L', colour: 'Beige', colourHex: '#F5F5DC', stock: 8 },
    ],
    isActive: true,
    createdAt: '2026-10-07T10:00:00Z',
    updatedAt: '2026-10-07T10:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Kids Denim Dungaree',
    slug: 'kids-denim-dungaree',
    description:
      'Adorable denim dungaree for kids. Made from soft stretch denim with adjustable straps and front pocket detail. Easy snap buttons for convenience.',
    category: "Kids' Wear",
    categorySlug: 'kids-wear',
    images: [
      { id: 'img-10', url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop', alt: 'Kids denim dungaree' },
    ],
    price: 149900,
    salePrice: 129900,
    variants: [
      { size: '2-3Y', colour: 'Light Blue', colourHex: '#ADD8E6', stock: 8 },
      { size: '4-5Y', colour: 'Light Blue', colourHex: '#ADD8E6', stock: 10 },
      { size: '6-7Y', colour: 'Light Blue', colourHex: '#ADD8E6', stock: 6 },
      { size: '2-3Y', colour: 'Dark Blue', colourHex: '#00008B', stock: 5 },
      { size: '4-5Y', colour: 'Dark Blue', colourHex: '#00008B', stock: 7 },
      { size: '6-7Y', colour: 'Dark Blue', colourHex: '#00008B', stock: 4 },
    ],
    isActive: true,
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Woven Cotton Scarf',
    slug: 'woven-cotton-scarf',
    description:
      'Handwoven cotton scarf with tasselled edges. Lightweight and versatile — works as a scarf, stole, or headwrap. Soft-dyed colours that age beautifully.',
    category: 'Accessories',
    categorySlug: 'accessories',
    images: [
      { id: 'img-11', url: 'https://images.unsplash.com/photo-1601924921557-45e8e0e6528f?w=600&h=800&fit=crop', alt: 'Woven cotton scarf' },
    ],
    price: 69900,
    variants: [
      { size: 'Free Size', colour: 'Mustard', colourHex: '#FFDB58', stock: 20 },
      { size: 'Free Size', colour: 'Indigo', colourHex: '#4B0082', stock: 15 },
      { size: 'Free Size', colour: 'Terracotta', colourHex: '#E2725B', stock: 12 },
    ],
    isActive: true,
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Leather Belt',
    slug: 'leather-belt',
    description:
      'Genuine leather belt with a brushed metal buckle. Classic design suitable for both formal and casual wear. Available in two timeless colours.',
    category: 'Accessories',
    categorySlug: 'accessories',
    images: [
      { id: 'img-12', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', alt: 'Leather belt' },
    ],
    price: 99900,
    variants: [
      { size: 'S (28-30)', colour: 'Brown', colourHex: '#8B4513', stock: 10 },
      { size: 'M (32-34)', colour: 'Brown', colourHex: '#8B4513', stock: 12 },
      { size: 'L (36-38)', colour: 'Brown', colourHex: '#8B4513', stock: 8 },
      { size: 'S (28-30)', colour: 'Black', colourHex: '#222222', stock: 10 },
      { size: 'M (32-34)', colour: 'Black', colourHex: '#222222', stock: 12 },
      { size: 'L (36-38)', colour: 'Black', colourHex: '#222222', stock: 8 },
    ],
    isActive: true,
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
];

/** Get unique colours for a product */
export function getProductColours(product: Product) {
  const seen = new Set<string>();
  return product.variants.filter((v) => {
    if (seen.has(v.colour)) return false;
    seen.add(v.colour);
    return true;
  });
}

/** Get unique sizes for a product, optionally filtered by colour */
export function getProductSizes(product: Product, colour?: string) {
  const filtered = colour
    ? product.variants.filter((v) => v.colour === colour)
    : product.variants;
  const seen = new Set<string>();
  return filtered.filter((v) => {
    if (seen.has(v.size)) return false;
    seen.add(v.size);
    return true;
  });
}

/** Find the specific variant */
export function findVariant(product: Product, size: string, colour: string) {
  return product.variants.find((v) => v.size === size && v.colour === colour);
}

/** Get products by category slug */
export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug && p.isActive);
}

/** Get featured/sale products */
export function getSaleProducts() {
  return products.filter((p) => p.salePrice && p.isActive);
}

