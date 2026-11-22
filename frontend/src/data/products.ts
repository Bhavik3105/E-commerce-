import { Product } from '@/types';

// Dummy catalogue for the homepage. Replace these when real products are added.
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Everyday Cotton T-Shirt',
    slug: 'everyday-cotton-tshirt',
    description: 'A soft combed-cotton tee with a regular fit and ribbed neckline. Made for daily wear.',
    category: 'T-Shirts',
    categorySlug: 'tshirts',
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop', alt: 'Everyday cotton t-shirt' },
    ],
    price: 79900,
    salePrice: 59900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 16 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 10 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 14 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 9 },
    ],
    isActive: true,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Relaxed Fit T-Shirt',
    slug: 'relaxed-fit-tshirt',
    description: 'A relaxed cotton tee with dropped shoulders. Light, breathable and easy to layer.',
    category: 'T-Shirts',
    categorySlug: 'tshirts',
    images: [
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop', alt: 'Relaxed fit t-shirt' },
    ],
    price: 89900,
    variants: [
      { size: 'S', colour: 'Olive', colourHex: '#556B2F', stock: 8 },
      { size: 'M', colour: 'Olive', colourHex: '#556B2F', stock: 11 },
      { size: 'L', colour: 'Olive', colourHex: '#556B2F', stock: 7 },
      { size: 'M', colour: 'Maroon', colourHex: '#800000', stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-11-02T10:00:00Z',
    updatedAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Classic Crew Neck Tee',
    slug: 'classic-crew-neck-tee',
    description: 'A close-fitting crew neck tee in combed cotton. Sits neatly and washes without losing shape.',
    category: 'T-Shirts',
    categorySlug: 'tshirts',
    images: [
      { id: 'img-7', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop', alt: 'Classic crew neck tee' },
    ],
    price: 74900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 10 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 14 },
      { size: 'L', colour: 'Navy', colourHex: '#1B2A4A', stock: 8 },
      { size: 'XL', colour: 'Navy', colourHex: '#1B2A4A', stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-11-07T10:00:00Z',
    updatedAt: '2026-11-07T10:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Boxy Cotton Tee',
    slug: 'boxy-cotton-tee',
    description: 'A boxy cotton t-shirt with a slightly longer hem. Easy to wear on its own.',
    category: 'T-Shirts',
    categorySlug: 'tshirts',
    images: [
      { id: 'img-8', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop', alt: 'Boxy cotton tee' },
    ],
    price: 84900,
    salePrice: 69900,
    variants: [
      { size: 'S', colour: 'Black', colourHex: '#222222', stock: 9 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 12 },
      { size: 'L', colour: 'Sage', colourHex: '#9CAF88', stock: 7 },
      { size: 'XL', colour: 'Sage', colourHex: '#9CAF88', stock: 5 },
    ],
    isActive: true,
    createdAt: '2026-11-08T10:00:00Z',
    updatedAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Cotton Nightsuit Set',
    slug: 'cotton-nightsuit-set',
    description: 'A two-piece nightsuit: a short-sleeve top and full-length pants with an elastic waist.',
    category: 'Nightsuits',
    categorySlug: 'nightsuits',
    images: [
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', alt: 'Cotton nightsuit set' },
    ],
    price: 149900,
    salePrice: 129900,
    variants: [
      { size: 'S', colour: 'Blush', colourHex: '#E8B4B8', stock: 8 },
      { size: 'M', colour: 'Blush', colourHex: '#E8B4B8', stock: 10 },
      { size: 'L', colour: 'Blush', colourHex: '#E8B4B8', stock: 7 },
      { size: 'M', colour: 'Navy', colourHex: '#1B2A4A', stock: 9 },
      { size: 'L', colour: 'Navy', colourHex: '#1B2A4A', stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-11-03T10:00:00Z',
    updatedAt: '2026-11-03T10:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Button-Front Sleep Set',
    slug: 'button-front-sleep-set',
    description: 'A nightsuit with a button-front shirt and straight pants in lightweight cotton.',
    category: 'Nightsuits',
    categorySlug: 'nightsuits',
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop', alt: 'Button-front sleep set' },
    ],
    price: 169900,
    variants: [
      { size: 'S', colour: 'Grey', colourHex: '#9CA3AF', stock: 6 },
      { size: 'M', colour: 'Grey', colourHex: '#9CA3AF', stock: 8 },
      { size: 'L', colour: 'Grey', colourHex: '#9CA3AF', stock: 5 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 7 },
    ],
    isActive: true,
    createdAt: '2026-11-04T10:00:00Z',
    updatedAt: '2026-11-04T10:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Printed Cotton Nightsuit',
    slug: 'printed-cotton-nightsuit',
    description: 'A printed cotton nightsuit set with a relaxed top and full-length pants.',
    category: 'Nightsuits',
    categorySlug: 'nightsuits',
    images: [
      { id: 'img-9', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Printed cotton nightsuit' },
    ],
    price: 159900,
    variants: [
      { size: 'S', colour: 'Lilac', colourHex: '#C8A2C8', stock: 6 },
      { size: 'M', colour: 'Lilac', colourHex: '#C8A2C8', stock: 8 },
      { size: 'L', colour: 'Lilac', colourHex: '#C8A2C8', stock: 5 },
      { size: 'M', colour: 'Ivory', colourHex: '#FFFFF0', stock: 7 },
    ],
    isActive: true,
    createdAt: '2026-11-09T10:00:00Z',
    updatedAt: '2026-11-09T10:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Short Sleeve Night Set',
    slug: 'short-sleeve-night-set',
    description: 'A light short-sleeve top with matching pants for warm nights.',
    category: 'Nightsuits',
    categorySlug: 'nightsuits',
    images: [
      { id: 'img-10', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', alt: 'Short sleeve night set' },
    ],
    price: 139900,
    salePrice: 119900,
    variants: [
      { size: 'S', colour: 'Peach', colourHex: '#FFCBA4', stock: 8 },
      { size: 'M', colour: 'Peach', colourHex: '#FFCBA4', stock: 10 },
      { size: 'L', colour: 'Peach', colourHex: '#FFCBA4', stock: 6 },
      { size: 'XL', colour: 'Peach', colourHex: '#FFCBA4', stock: 4 },
    ],
    isActive: true,
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Cotton Camisole',
    slug: 'cotton-camisole',
    description: 'An everyday cotton camisole with adjustable straps. Soft against the skin and easy under a tee.',
    category: 'Undergarments',
    categorySlug: 'undergarments',
    images: [
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', alt: 'Cotton camisole' },
    ],
    price: 49900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 15 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 18 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'Skin', colourHex: '#E6C2A6', stock: 10 },
    ],
    isActive: true,
    createdAt: '2026-11-05T10:00:00Z',
    updatedAt: '2026-11-05T10:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Everyday Cotton Briefs',
    slug: 'everyday-cotton-briefs',
    description: 'Full-coverage cotton briefs with a soft elastic waistband, made for daily comfort.',
    category: 'Undergarments',
    categorySlug: 'undergarments',
    images: [
      { id: 'img-6', url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop', alt: 'Everyday cotton briefs' },
    ],
    price: 34900,
    salePrice: 29900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 20 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 22 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 16 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 14 },
    ],
    isActive: true,
    createdAt: '2026-11-06T10:00:00Z',
    updatedAt: '2026-11-06T10:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Cotton Bralette',
    slug: 'cotton-bralette',
    description: 'A soft cotton bralette with wide straps and light support for everyday wear.',
    category: 'Undergarments',
    categorySlug: 'undergarments',
    images: [
      { id: 'img-11', url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop', alt: 'Cotton bralette' },
    ],
    price: 59900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 14 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 10 },
      { size: 'XL', colour: 'Black', colourHex: '#222222', stock: 8 },
    ],
    isActive: true,
    createdAt: '2026-11-11T10:00:00Z',
    updatedAt: '2026-11-11T10:00:00Z',
  },
  {
    id: 'prod-12',
    name: 'High-Waist Cotton Briefs',
    slug: 'high-waist-cotton-briefs',
    description: 'High-waist cotton briefs with a soft covered waistband and full coverage.',
    category: 'Undergarments',
    categorySlug: 'undergarments',
    images: [
      { id: 'img-12', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop', alt: 'High-waist cotton briefs' },
    ],
    price: 39900,
    variants: [
      { size: 'S', colour: 'Nude', colourHex: '#E6C2A6', stock: 11 },
      { size: 'M', colour: 'Nude', colourHex: '#E6C2A6', stock: 13 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 9 },
      { size: 'XL', colour: 'Black', colourHex: '#222222', stock: 7 },
    ],
    isActive: true,
    createdAt: '2026-11-12T10:00:00Z',
    updatedAt: '2026-11-12T10:00:00Z',
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
