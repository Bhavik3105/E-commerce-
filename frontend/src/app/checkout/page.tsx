'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/lib/account-context';
import { useCart } from '@/lib/cart-context';
import { CheckoutForm, CheckoutFormData } from '@/components/checkout/CheckoutForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/utils';
import { apiBase } from '@/lib/api';
import { loadRazorpay, type RazorpaySuccess } from '@/lib/razorpay';

type PaymentSession = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  checkoutToken: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, ready } = useCart();
  const { customer, ready: accountReady, token } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountReady) return;
    if (!customer) router.replace('/login?next=/checkout');
  }, [accountReady, customer, router]);

  const freeShippingThreshold = 99900;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const shippingCharge = isFreeShipping ? 0 : 200;
  const grandTotal = totalPrice + shippingCharge;

  const handleFormSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);
    setError('');

    if (!token) {
      router.replace('/login?next=/checkout');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch(`${apiBase()}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: formData.customer,
        deliveryAddress: formData.deliveryAddress,
        notes: formData.notes,
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          colour: item.colour,
          quantity: item.quantity,
        })),
      }),
    });
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
      data?: { orderNumber: string };
      payment?: PaymentSession;
    };
    if (response.status === 401) {
      router.replace('/login?next=/checkout');
      setIsSubmitting(false);
      return;
    }
    if (!response.ok || !body.data || !body.payment) {
      setError(body.message || 'The order could not be started.');
      setIsSubmitting(false);
      return;
    }

    const readyToPay = await loadRazorpay();
    if (!readyToPay || !window.Razorpay) {
      await fetch(`${apiBase()}/api/orders/${body.data.orderNumber}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutToken: body.payment.checkoutToken }),
      });
      setError('Razorpay could not be opened. Nothing was charged.');
      setIsSubmitting(false);
      return;
    }

    const payment = body.payment;
    const orderNumber = body.data.orderNumber;
    let finished = false;
    const checkout = new window.Razorpay({
      key: payment.keyId,
      amount: payment.amount,
      currency: payment.currency,
      name: 'Jummip',
      description: `Order ${orderNumber}`,
      order_id: payment.orderId,
      prefill: {
        name: formData.customer.name,
        email: formData.customer.email,
        contact: formData.customer.phone,
      },
      theme: { color: '#0d8428' },
      handler: (result: RazorpaySuccess) => {
        finished = true;
        void confirmPayment(orderNumber, payment.checkoutToken, result);
      },
      modal: {
        ondismiss: () => {
          if (finished) return;
          void cancelPayment(orderNumber, payment.checkoutToken);
        },
      },
    });
    checkout.open();
  };

  async function confirmPayment(orderNumber: string, checkoutToken: string, result: RazorpaySuccess) {
    const response = await fetch(`${apiBase()}/api/orders/${orderNumber}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutToken,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      }),
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setError(body.message || `Payment was received for ${orderNumber}, but it could not be confirmed. Contact the store with this order number.`);
      setIsSubmitting(false);
      return;
    }
    clearCart();
    router.push(`/order/${orderNumber}/status`);
  }

  async function cancelPayment(orderNumber: string, checkoutToken: string) {
    await fetch(`${apiBase()}/api/orders/${orderNumber}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutToken }),
    });
    setError('Payment was not completed. Your cart is still here, and nothing was charged.');
    setIsSubmitting(false);
  }

  if (!ready || !accountReady || !customer) {
    return (
      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Checkout' }]} />
        <LoadingSpinner size="lg" label="Checking your account..." />
      </div>
    );
  }

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
          Signed in as {customer.email}. After payment, this order stays on your account with its delivery status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <CheckoutForm
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
            account={{ name: customer.name, email: customer.email, phone: customer.phone }}
          />
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
                      unoptimized
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

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-500">
              <p className="font-medium text-neutral-700 mb-0.5">Pay with Razorpay</p>
              Cards, UPI, and netbanking open in Razorpay. Jummip does not store card numbers.
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
