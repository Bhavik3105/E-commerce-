import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts, productsForCategory } from '@/lib/catalogue';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);
  if (!product) return { title: 'Product Not Found | Jummip' };

  return {
    title: product.seoTitle || `${product.name} | Jummip Garments`,
    description: product.seoDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const related = productsForCategory(await fetchProducts(), product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-6 space-y-12">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category, href: `/category/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <Suspense fallback={null}>
        <ProductDetailView product={product} />
      </Suspense>

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              You May Also Like
            </h2>
            <a
              href={`/category/${product.categorySlug}`}
              className="text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              More in {product.category} &rarr;
            </a>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}

