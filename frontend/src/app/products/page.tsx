import React from 'react';
import { fetchCategories, fetchProducts } from '@/lib/catalogue';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryNav } from '@/components/category/CategoryNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    sort?: string;
  };
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Products | Jummip Garments',
  description: 'Browse every Jummip collection, including t-shirts, nightsuits, undergarments and izaars.',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  const filtered = products.filter((p) => p.isActive);

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
          Shop every Jummip collection, made in soft cotton for everyday comfort.
        </p>

        <div className="pt-2">
          <CategoryNav categories={categories} />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs text-neutral-500 pb-2 border-b border-neutral-200 sm:flex-row sm:items-center sm:justify-between">
        <span className="whitespace-nowrap">Showing {filtered.length} products</span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="whitespace-nowrap">Sort by:</span>
          <a
            href="/products"
            className="whitespace-nowrap hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Featured
          </a>
          <span aria-hidden="true">•</span>
          <a
            href="/products?sort=price-low"
            className="whitespace-nowrap hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Price: Low to High
          </a>
          <span aria-hidden="true">•</span>
          <a
            href="/products?sort=price-high"
            className="whitespace-nowrap hover:text-primary-600 font-medium underline-offset-4 hover:underline"
          >
            Price: High to Low
          </a>
        </div>
      </div>

      <ProductGrid
        products={filtered}
        emptyMessage="No products yet. They will be added from the dashboard."
      />
    </div>
  );
}
