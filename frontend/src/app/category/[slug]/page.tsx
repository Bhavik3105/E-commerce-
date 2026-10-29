import React from 'react';
import { notFound } from 'next/navigation';
import { categories } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryNav } from '@/components/category/CategoryNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return { title: 'Category Not Found | Jummip' };

  return {
    title: `${category.name} | Jummip`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="container py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]}
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {category.name}
        </h1>
        <p className="text-sm text-neutral-500 max-w-2xl">{category.description}</p>

        <div className="pt-2">
          <CategoryNav categories={categories} activeSlug={category.slug} />
        </div>
      </div>

      <div className="text-xs text-neutral-500 pb-2 border-b border-neutral-200">
        Showing {categoryProducts.length} items in {category.name}
      </div>

      <ProductGrid
        products={categoryProducts}
        emptyMessage={`No items currently available in ${category.name}. Check back soon!`}
      />
    </div>
  );
}

