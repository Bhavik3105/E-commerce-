import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-xl bg-neutral-900 aspect-[4/3] block shadow-sm hover:shadow-md transition-shadow"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-90"
        />
      ) : (
        <div className="w-full h-full bg-neutral-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
        <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary-200 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-neutral-300 line-clamp-1">{category.description}</p>
        <div className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-primary-300 group-hover:underline">
          Explore Collection &rarr;
        </div>
      </div>
    </Link>
  );
}

