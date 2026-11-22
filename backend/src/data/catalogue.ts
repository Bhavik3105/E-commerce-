export const seedCategories = [
  {
    name: 'T-Shirts',
    slug: 'tshirts',
    description: 'Soft cotton tees for everyday wear.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
    sortOrder: 1,
  },
  {
    name: 'Nightsuits',
    slug: 'nightsuits',
    description: 'Comfortable cotton sets for sleep and lounging.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop',
    sortOrder: 2,
  },
  {
    name: 'Undergarments',
    slug: 'undergarments',
    description: 'Everyday cotton camisoles and briefs.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop',
    sortOrder: 3,
  },
  {
    name: 'Izaar',
    slug: 'izaar',
    description: 'Soft cotton izaars for comfort at home and everyday wear.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop',
    sortOrder: 4,
  },
];

type SeedVariant = { size: string; colour: string; colourHex: string; stock: number };

export const seedProducts: Array<{
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  image: { url: string; alt: string };
  price: number;
  salePrice?: number;
  variants: SeedVariant[];
}> = [
  {
    name: 'Everyday Cotton T-Shirt',
    slug: 'everyday-cotton-tshirt',
    description: 'A soft combed-cotton tee with a regular fit and ribbed neckline. Made for daily wear.',
    categorySlug: 'tshirts',
    image: { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop', alt: 'Everyday cotton t-shirt' },
    price: 79900,
    salePrice: 59900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 16 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 10 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 14 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 9 },
    ],
  },
  {
    name: 'Relaxed Fit T-Shirt',
    slug: 'relaxed-fit-tshirt',
    description: 'A relaxed cotton tee with dropped shoulders. Light, breathable and easy to layer.',
    categorySlug: 'tshirts',
    image: { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop', alt: 'Relaxed fit t-shirt' },
    price: 89900,
    variants: [
      { size: 'S', colour: 'Olive', colourHex: '#556B2F', stock: 8 },
      { size: 'M', colour: 'Olive', colourHex: '#556B2F', stock: 11 },
      { size: 'L', colour: 'Olive', colourHex: '#556B2F', stock: 7 },
      { size: 'M', colour: 'Maroon', colourHex: '#800000', stock: 6 },
    ],
  },
  {
    name: 'Classic Crew Neck Tee',
    slug: 'classic-crew-neck-tee',
    description: 'A close-fitting crew neck tee in combed cotton. Sits neatly and washes without losing shape.',
    categorySlug: 'tshirts',
    image: { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop', alt: 'Classic crew neck tee' },
    price: 74900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 10 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 14 },
      { size: 'L', colour: 'Navy', colourHex: '#1B2A4A', stock: 8 },
      { size: 'XL', colour: 'Navy', colourHex: '#1B2A4A', stock: 6 },
    ],
  },
  {
    name: 'Boxy Cotton Tee',
    slug: 'boxy-cotton-tee',
    description: 'A boxy cotton t-shirt with a slightly longer hem. Easy to wear on its own.',
    categorySlug: 'tshirts',
    image: { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop', alt: 'Boxy cotton tee' },
    price: 84900,
    salePrice: 69900,
    variants: [
      { size: 'S', colour: 'Black', colourHex: '#222222', stock: 9 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 12 },
      { size: 'L', colour: 'Sage', colourHex: '#9CAF88', stock: 7 },
      { size: 'XL', colour: 'Sage', colourHex: '#9CAF88', stock: 5 },
    ],
  },
  {
    name: 'Cotton Nightsuit Set',
    slug: 'cotton-nightsuit-set',
    description: 'A two-piece nightsuit: a short-sleeve top and full-length pants with an elastic waist.',
    categorySlug: 'nightsuits',
    image: { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', alt: 'Cotton nightsuit set' },
    price: 149900,
    salePrice: 129900,
    variants: [
      { size: 'S', colour: 'Blush', colourHex: '#E8B4B8', stock: 8 },
      { size: 'M', colour: 'Blush', colourHex: '#E8B4B8', stock: 10 },
      { size: 'L', colour: 'Blush', colourHex: '#E8B4B8', stock: 7 },
      { size: 'M', colour: 'Navy', colourHex: '#1B2A4A', stock: 9 },
      { size: 'L', colour: 'Navy', colourHex: '#1B2A4A', stock: 6 },
    ],
  },
  {
    name: 'Button-Front Sleep Set',
    slug: 'button-front-sleep-set',
    description: 'A nightsuit with a button-front shirt and straight pants in lightweight cotton.',
    categorySlug: 'nightsuits',
    image: { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop', alt: 'Button-front sleep set' },
    price: 169900,
    variants: [
      { size: 'S', colour: 'Grey', colourHex: '#9CA3AF', stock: 6 },
      { size: 'M', colour: 'Grey', colourHex: '#9CA3AF', stock: 8 },
      { size: 'L', colour: 'Grey', colourHex: '#9CA3AF', stock: 5 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 7 },
    ],
  },
  {
    name: 'Printed Cotton Nightsuit',
    slug: 'printed-cotton-nightsuit',
    description: 'A printed cotton nightsuit set with a relaxed top and full-length pants.',
    categorySlug: 'nightsuits',
    image: { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Printed cotton nightsuit' },
    price: 159900,
    variants: [
      { size: 'S', colour: 'Lilac', colourHex: '#C8A2C8', stock: 6 },
      { size: 'M', colour: 'Lilac', colourHex: '#C8A2C8', stock: 8 },
      { size: 'L', colour: 'Lilac', colourHex: '#C8A2C8', stock: 5 },
      { size: 'M', colour: 'Ivory', colourHex: '#FFFFF0', stock: 7 },
    ],
  },
  {
    name: 'Short Sleeve Night Set',
    slug: 'short-sleeve-night-set',
    description: 'A light short-sleeve top with matching pants for warm nights.',
    categorySlug: 'nightsuits',
    image: { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', alt: 'Short sleeve night set' },
    price: 139900,
    salePrice: 119900,
    variants: [
      { size: 'S', colour: 'Peach', colourHex: '#FFCBA4', stock: 8 },
      { size: 'M', colour: 'Peach', colourHex: '#FFCBA4', stock: 10 },
      { size: 'L', colour: 'Peach', colourHex: '#FFCBA4', stock: 6 },
      { size: 'XL', colour: 'Peach', colourHex: '#FFCBA4', stock: 4 },
    ],
  },
  {
    name: 'Cotton Camisole',
    slug: 'cotton-camisole',
    description: 'An everyday cotton camisole with adjustable straps. Soft against the skin and easy under a tee.',
    categorySlug: 'undergarments',
    image: { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', alt: 'Cotton camisole' },
    price: 49900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 15 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 18 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'Skin', colourHex: '#E6C2A6', stock: 10 },
    ],
  },
  {
    name: 'Everyday Cotton Briefs',
    slug: 'everyday-cotton-briefs',
    description: 'Full-coverage cotton briefs with a soft elastic waistband, made for daily comfort.',
    categorySlug: 'undergarments',
    image: { url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop', alt: 'Everyday cotton briefs' },
    price: 34900,
    salePrice: 29900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 20 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 22 },
      { size: 'L', colour: 'White', colourHex: '#FFFFFF', stock: 16 },
      { size: 'M', colour: 'Black', colourHex: '#222222', stock: 14 },
    ],
  },
  {
    name: 'Cotton Bralette',
    slug: 'cotton-bralette',
    description: 'A soft cotton bralette with wide straps and light support for everyday wear.',
    categorySlug: 'undergarments',
    image: { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop', alt: 'Cotton bralette' },
    price: 59900,
    variants: [
      { size: 'S', colour: 'White', colourHex: '#FFFFFF', stock: 12 },
      { size: 'M', colour: 'White', colourHex: '#FFFFFF', stock: 14 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 10 },
      { size: 'XL', colour: 'Black', colourHex: '#222222', stock: 8 },
    ],
  },
  {
    name: 'High-Waist Cotton Briefs',
    slug: 'high-waist-cotton-briefs',
    description: 'High-waist cotton briefs with a soft covered waistband and full coverage.',
    categorySlug: 'undergarments',
    image: { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop', alt: 'High-waist cotton briefs' },
    price: 39900,
    variants: [
      { size: 'S', colour: 'Nude', colourHex: '#E6C2A6', stock: 11 },
      { size: 'M', colour: 'Nude', colourHex: '#E6C2A6', stock: 13 },
      { size: 'L', colour: 'Black', colourHex: '#222222', stock: 9 },
      { size: 'XL', colour: 'Black', colourHex: '#222222', stock: 7 },
    ],
  },
];
