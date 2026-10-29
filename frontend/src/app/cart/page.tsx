'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const { items, clearCart } = useCart();

  return (
    <div className="container py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <div className="flex justify-between items-baseline pb-2 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Shopping Cart
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added any garments to your cart yet. Explore our latest arrivals to get started!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={`${item.productId}__${item.size}__${item.colour}`}
                item={item}
              />
            ))}

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center text-xs font-semibold text-primary-700 hover:text-primary-800"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}

