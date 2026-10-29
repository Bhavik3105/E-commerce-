'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { CheckoutForm, CheckoutFormData } from '@/components/checkout/CheckoutForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const freeShippingThreshold = 99900;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const shippingCharge = isFreeShipping ? 0 : 9900;
  const grandTotal = totalPrice + shippingCharge;

  const handleFormSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // In Phase 1 (frontend mockup):
      // Store checkout order in session/localStorage to show realistic status page
      const mockOrderNumber = `JMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData = {
        orderNumber: mockOrderNumber,
        customer: formData.customer,
        deliveryAddress: formData.deliveryAddress,
        items,
        subtotal: totalPrice,
        shipping: shippingCharge,
        total: grandTotal,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`order_${mockOrderNumber}`, JSON.stringify(orderData));
      }

      // Clear cart
      clearCart();

      // Navigate to order status page
      router.push(`/order/${mockOrderNumber}/status`);
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Checkout' }]} />
        <EmptyState
          title="Your cart is empty"
          message="You cannot checkout with an empty cart. Please add some garments to your cart first."
          actionLabel="Return to Shop"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Shopping Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Complete your customer and delivery details to place your garment order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <CheckoutForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-base text-neutral-900 pb-3 border-b border-neutral-100 flex justify-between items-center">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-neutral-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h3>

            {/* Item Thumbnails */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}__${item.size}__${item.colour}`}
                  className="flex gap-3 items-center text-xs"
                >
                  <div className="relative w-12 h-14 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-neutral-900 truncate">
                      {item.productName}
                    </h5>
                    <p className="text-neutral-500 text-[11px]">
                      {item.size} • {item.colour} • Qty {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-neutral-800">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs sm:text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    formatPrice(shippingCharge)
                  )}
                </span>
              </div>
              <div className="border-t border-neutral-100 pt-3 flex justify-between items-baseline font-bold text-neutral-900 text-base">
                <span>Total Due</span>
                <span className="text-lg text-primary-700">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Notice about Phase 1 test mode */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-500">
              <p className="font-medium text-neutral-700 mb-0.5">ℹ️ Phase 1 Preview Mode</p>
              Submitting this form records the order locally and navigates to the payment & order status screen. Real Razorpay checkout will be wired up in Phase 4.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
