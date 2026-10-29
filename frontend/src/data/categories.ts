import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: "Men's Wear",
    slug: 'mens-wear',
    description: 'Premium shirts, t-shirts, trousers and more for men.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: "Women's Wear",
    slug: 'womens-wear',
    description: 'Elegant kurtis, tops, dresses and more for women.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: "Kids' Wear",
    slug: 'kids-wear',
    description: 'Fun and comfortable clothing for kids of all ages.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Scarves, belts, caps and fashion accessories.',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 4,
  },
];

