'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/types';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] ?? images[0];

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={mainImage.url}
          alt={mainImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-stone-100 transition-all duration-200',
                index === selectedIndex
                  ? 'ring-2 ring-amber-700 ring-offset-1'
                  : 'opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
