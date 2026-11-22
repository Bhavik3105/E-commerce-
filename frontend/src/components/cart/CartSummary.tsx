'use client';

import React from 'react';
import Link from 'next/link';
import { useAccount } from '@/lib/account-context';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { totalItems, totalPrice } = useCart();
  const { customer, ready } = useAccount();
  const signedOut = ready && !customer;

  // Free shipping threshold: ₹999 (99900 paise)
  const freeShippingThreshold = 99900;
  const isFreeShipping = totalPrice >= freeShippingThreshold || totalPrice === 0;
  const shippingCharge = isFreeShipping ? 0 : 200; // ₹2
  const finalTotal = totalPrice + shippingCharge;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900 pb-4 border-b border-neutral-100">
        Order Summary
      </h2>

      <div className="space-y-3 py-4 text-sm border-b border-neutral-100">
        <div className="flex justify-between text-neutral-600">
          <span>Items ({totalItems})</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Delivery</span>
          <span>
            {isFreeShipping ? (
              <span className="text-emerald-600 font-medium">FREE</span>
            ) : (
              formatPrice(shippingCharge)
            )}
          </span>
        </div>

        {totalPrice < freeShippingThreshold && totalPrice > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Add {formatPrice(freeShippingThreshold - totalPrice)} more to qualify for <strong>FREE Delivery</strong>!
          </p>
        )}
      </div>

      <div className="pt-4 pb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold text-neutral-900">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-neutral-900">
              {formatPrice(finalTotal)}
            </span>
            <span className="block text-xs text-neutral-400">Inclusive of all taxes</span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          href={signedOut ? '/login?next=/checkout' : '/checkout'}
          className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {signedOut ? 'Sign in to checkout' : 'Proceed to Checkout'}
        </Link>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure 256-bit encrypted checkout</span>
      </div>
    </div>
  );
}

