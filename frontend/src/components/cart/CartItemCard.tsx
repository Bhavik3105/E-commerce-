'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { QuantitySelector } from '@/components/product/QuantitySelector';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQty: number) => {
    updateQuantity(item.productId, item.size, item.colour, newQty);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size, item.colour);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-200/80 shadow-sm">
      <Link
        href={`/products/${item.productSlug}`}
        className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
      >
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium text-sm sm:text-base text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1"
            >
              {item.productName}
            </Link>
            <button
              type="button"
              onClick={handleRemove}
              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
              aria-label={`Remove ${item.productName}`}
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
            <span>Size: <strong className="text-neutral-800">{item.size}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              Colour:
              <span
                className="w-3 h-3 rounded-full border border-neutral-300 inline-block"
                style={{ backgroundColor: item.colourHex }}
              />
              <strong className="text-neutral-800">{item.colour}</strong>
            </span>
          </div>

          <div className="mt-1 text-xs text-neutral-500">
            {formatPrice(item.price)} each
          </div>
        </div>

        <div className="flex justify-between items-end mt-3 pt-2 border-t border-neutral-100">
          <QuantitySelector
            quantity={item.quantity}
            maxQuantity={item.maxStock}
            onChange={handleQuantityChange}
          />
          <div className="text-right">
            <span className="text-xs text-neutral-400 block">Total</span>
            <span className="font-semibold text-sm sm:text-base text-neutral-900">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
