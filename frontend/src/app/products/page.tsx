import React from 'react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryNav } from '@/components/category/CategoryNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    sort?: string;
  };
}

export const metadata = {
  title: 'All Products | Jummip Garments',
  description: 'Browse all garments in our store: men, women, kids apparel and accessories.',
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const filtered = [...products].filter((p) => p.isActive);

  // Sorting
  if (searchParams?.sort === 'price-low') {
    filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (searchParams?.sort === 'price-high') {
    filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  }

  return (
    <div className="container py-6 space-y-8">
      <Breadcrumb items={[{ label: 'All Products' }]} />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          All Products
        </h1>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Discover our full collection of thoughtfully designed clothing made from natural fibers and crafted for long-lasting wear.
        </p>

        <div className="pt-2">
          <CategoryNav categories={categories} />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-neutral-200">
        <span>Showing {filtered.length} products</span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <a
            href="/products"
            className="hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Featured
          </a>
          <span>•</span>
          <a
            href="/products?sort=price-low"
            className="hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Price: Low to High
          </a>
          <span>•</span>
          <a
            href="/products?sort=price-high"
            className="hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Price: High to Low
          </a>
        </div>
      </div>

      <ProductGrid
        products={filtered}
        emptyMessage="No products found in this collection."
      />
    </div>
  );
}
