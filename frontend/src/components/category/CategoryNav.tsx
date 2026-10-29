import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
  className?: string;
}

export function CategoryNav({
  categories,
  activeSlug,
  className,
}: CategoryNavProps) {
  return (
    <nav
      aria-label="Category Navigation"
      className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}
    >
      <Link
        href="/products"
        className={cn(
          'whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border',
          !activeSlug
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
        )}
      >
        All Products
      </Link>
      {categories
        .filter((c) => c.isActive)
        .map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={cn(
                'whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border',
                isActive
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              )}
            >
              {cat.name}
            </Link>
          );
        })}
    </nav>
  );
}
