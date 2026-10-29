import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, category, images, price, salePrice } = product;
  const thumbnail = images[0];
  const discount = salePrice ? getDiscountPercent(price, salePrice) : 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {thumbnail && (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-amber-700 text-white text-xs font-semibold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="text-sm sm:text-base font-medium text-stone-800 line-clamp-2 leading-snug mb-2 group-hover:text-amber-800 transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          {salePrice ? (
            <>
              <span className="text-sm sm:text-base font-semibold text-amber-700">
                {formatPrice(salePrice)}
              </span>
              <span className="text-xs sm:text-sm text-stone-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-semibold text-stone-800">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
