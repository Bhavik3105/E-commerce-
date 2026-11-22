import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    slug: 'tshirts',
    description: 'Soft cotton tees for everyday wear.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Nightsuits',
    slug: 'nightsuits',
    description: 'Comfortable cotton sets for sleep and lounging.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Undergarments',
    slug: 'undergarments',
    description: 'Everyday cotton camisoles and briefs.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 3,
  },
];
