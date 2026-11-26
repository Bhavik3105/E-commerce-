'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from '@/lib/account-context';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { apiBase } from '@/lib/api';

interface StoredOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  colour: string;
  priceAtPurchase: number;
  quantity: number;
}

interface StoredOrder {
  orderNumber: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  deliveryAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items?: StoredOrderItem[];
  subtotal?: number;
  shipping?: number;
  total?: number;
  paymentStatus?: string;
  orderStatus?: string;
  shipmentStatus?: string;
  cancelReasonLabel?: string | null;
  refundNote?: string | null;
  paidAt?: string;
}

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { ready, token } = useAccount();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!orderId || !ready) return;
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(`/order/${orderId}/status`)}`);
      return;
    }
    let active = true;
    fetch(`${apiBase()}/api/orders/${orderId}`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(`/order/${orderId}/status`)}`);
          return 'auth' as const;
        }
        if (!response.ok) return null;
        const body = (await response.json()) as { data?: StoredOrder };
        return body.data ?? null;
      })
      .then((data) => {
        if (!active || data === 'auth') return;
        setOrder(data);
        setMissing(!data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setMissing(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderId, ready, token, router]);

  if (loading) {
    return (
      <div className="container py-24 flex justify-center">
        <LoadingSpinner size="lg" label="Loading order details..." />
      </div>
    );
  }

  if (missing || !order) {
    return (
      <div className="container py-16 max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900">Order not found</h1>
        <p className="text-sm text-neutral-500">Check the order number, or return to the shop.</p>
        <Link href="/products" className="inline-flex px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const isCancelled = isPaid && order.orderStatus === 'cancelled';
  const delivery =
    order.shipmentStatus === 'delivered'
      ? 'Delivered'
      : order.shipmentStatus === 'shipped'
        ? 'Shipped'
        : 'Preparing to ship';

  return (
    <div className="container py-8 max-w-3xl space-y-8">
      {/* ─── Status Banner ─── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm text-center space-y-4">
        {isCancelled ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
              Order cancelled
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">This order was cancelled</h1>
            <p className="text-sm text-neutral-700 max-w-md mx-auto">
              <strong>Reason:</strong> {order.cancelReasonLabel || 'This order was cancelled.'}
            </p>
            <p className="text-sm font-medium text-neutral-900 max-w-md mx-auto">{order.refundNote}</p>
          </>
        ) : isPaid ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Payment Verified & Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Payment is confirmed for{' '}
              <strong className="text-neutral-900">{order.customer?.email || 'this order'}</strong>.
              Delivery status: <strong>{delivery}</strong>. You can open this order again from your account.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Order Created — Awaiting Payment
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Order #{orderId}
            </h1>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              This order was not paid. Nothing was charged. You can place it again from your cart.
            </p>
          </>
        )}
      </div>

      {/* ─── Order Summary Details ─── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-xs text-neutral-400">Order Reference</span>
            <h3 className="text-base font-bold text-neutral-900">{orderId}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400">Status</span>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                {isCancelled ? 'Cancelled' : isPaid ? delivery : 'Pending Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <h4 className="font-semibold text-neutral-900 mb-2">Customer Information</h4>
            <p className="text-neutral-700 font-medium">{order?.customer?.name || 'Customer'}</p>
            <p className="text-neutral-500">{order?.customer?.email || 'email@example.com'}</p>
            <p className="text-neutral-500">+91 {order?.customer?.phone || '9876543210'}</p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <h4 className="font-semibold text-neutral-900 mb-2">Delivery Address</h4>
            <p className="text-neutral-700">
              {order?.deliveryAddress?.line1 || 'Address Line 1'}
              {order?.deliveryAddress?.line2 ? `, ${order.deliveryAddress.line2}` : ''}
            </p>
            <p className="text-neutral-500">
              {order?.deliveryAddress?.city || 'City'}, {order?.deliveryAddress?.state || 'State'} -{' '}
              {order?.deliveryAddress?.pincode || '400001'}
            </p>
            <p className="text-neutral-500 mt-1 font-medium text-[11px] text-primary-700">
              Courier Delivery: Local Courier Service
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-sm text-neutral-900">Purchased Garments</h4>
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
            {order?.items?.map((item: StoredOrderItem, idx: number) => (
              <div key={idx} className="flex gap-4 p-3.5 bg-white items-center">
                <div className="relative w-12 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs sm:text-sm">
                  <h5 className="font-medium text-neutral-900 truncate">{item.productName}</h5>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    Size: <strong>{item.size}</strong> • Colour: <strong>{item.colour}</strong> • Qty: {item.quantity}
                  </p>
                </div>
                <div className="font-semibold text-neutral-900 text-sm">
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </div>
              </div>
            )) || (
              <div className="p-4 text-xs text-neutral-500 text-center">
                Sample order preview
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs sm:text-sm text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order?.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order?.shipping === 0 ? (
                <span className="text-emerald-600 font-semibold">FREE</span>
              ) : (
                formatPrice(order?.shipping || 0)
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t border-neutral-100">
            <span>Total Paid / Due</span>
            <span className="text-primary-700">{formatPrice(order?.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* ─── Next Steps / Actions ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/account"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Your orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold text-neutral-800 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        <Link
          href="/contact"
          className="text-xs text-neutral-500 hover:text-neutral-800"
        >
          Need help with this order? Contact support &rarr;
        </Link>
      </div>
    </div>
  );
}
