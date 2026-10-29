'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StoredOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  colour: string;
  price: number;
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
  paidAt?: string;
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedPaid, setSimulatedPaid] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && orderId) {
      const stored = localStorage.getItem(`order_${orderId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrder(parsed);
          if (parsed.paymentStatus === 'paid') {
            setSimulatedPaid(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
  }, [orderId]);

  const handleSimulatePaymentSuccess = () => {
    if (order) {
      const updated = {
        ...order,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        shipmentStatus: 'not_shipped',
        paidAt: new Date().toISOString(),
      };
      setOrder(updated);
      setSimulatedPaid(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`order_${orderId}`, JSON.stringify(updated));
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-24 flex justify-center">
        <LoadingSpinner size="lg" label="Loading order details..." />
      </div>
    );
  }

  const isPaid = simulatedPaid || order?.paymentStatus === 'paid';

  return (
    <div className="container py-8 max-w-3xl space-y-8">
      {/* ─── Status Banner ─── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm text-center space-y-4">
        {isPaid ? (
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
              We have received your payment. A confirmation email has been sent to{' '}
              <strong className="text-neutral-900">{order?.customer?.email || 'your email'}</strong>.
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
              Your order is recorded and waiting for payment verification.
            </p>

            {/* Test Simulation Button for Phase 1 preview */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 max-w-md mx-auto text-left space-y-2">
              <p className="text-xs font-semibold text-amber-900">
                ⚡ Phase 1 UI Verification Control
              </p>
              <p className="text-xs text-amber-800">
                In Phase 4, Razorpay Checkout will automatically handle real payment verification. Click below to preview the verified/paid order layout:
              </p>
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                className="w-full py-2 px-4 rounded-lg text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-colors"
              >
                Simulate Successful Razorpay Payment
              </button>
            </div>
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
                {isPaid ? 'Confirmed / Processing' : 'Pending Payment'}
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
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs sm:text-sm">
                  <h5 className="font-medium text-neutral-900 truncate">{item.productName}</h5>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    Size: <strong>{item.size}</strong> • Colour: <strong>{item.colour}</strong> • Qty: {item.quantity}
                  </p>
                </div>
                <div className="font-semibold text-neutral-900 text-sm">
                  {formatPrice(item.price * item.quantity)}
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
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Continue Shopping
        </Link>
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
