import React from 'react';
import { notFound } from 'next/navigation';
import { fetchCategories, fetchProducts, productsForCategory } from '@/lib/catalogue';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryNav } from '@/components/category/CategoryNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) return { title: 'Category Not Found | Jummip' };

  return {
    title: `${category.name} | Jummip`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = productsForCategory(await fetchProducts(), category.slug);

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
        emptyMessage={`No products in ${category.name} yet. They will be added from the dashboard.`}
      />
    </div>
  );
}
