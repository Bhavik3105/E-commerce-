'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/lib/account-context';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { apiBase } from '@/lib/api';

interface AccountOrderItem {
  productName: string;
  productImage: string;
  size: string;
  colour: string;
  quantity: number;
  priceAtPurchase: number;
}

interface AccountOrder {
  orderNumber: string;
  createdAt: string;
  total: number;
  shipmentStatus: string;
  items: AccountOrderItem[];
}

function deliveryLabel(status: string): string {
  if (status === 'shipped') return 'Shipped';
  if (status === 'delivered') return 'Delivered';
  return 'Preparing to ship';
}

function deliveryClass(status: string): string {
  if (status === 'delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'shipped') return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

export default function AccountPage() {
  const router = useRouter();
  const { ready, customer, token, logout } = useAccount();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!customer || !token) {
      router.replace('/login?next=/account');
      return;
    }
    let active = true;
    fetch(`${apiBase()}/api/account/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (response.status === 401) return null;
        const body = (await response.json().catch(() => ({}))) as { data?: AccountOrder[] };
        return body.data ?? [];
      })
      .then((data) => {
        if (!active) return;
        if (!data) {
          router.replace('/login?next=/account');
          return;
        }
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setOrders([]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ready, customer, token, router]);

  if (!ready || !customer || loading) {
    return (
      <div className="container py-24 flex justify-center">
        <LoadingSpinner size="lg" label="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Your orders</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Signed in as {customer.name} ({customer.email})
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Sign out
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">No paid orders yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            After a successful payment, the garments and delivery status appear here.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.orderNumber} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <div>
                  <p className="text-xs text-neutral-400">Order</p>
                  <h2 className="font-semibold text-neutral-900">{order.orderNumber}</h2>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${deliveryClass(order.shipmentStatus)}`}>
                    {deliveryLabel(order.shipmentStatus)}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">{formatPrice(order.total)}</p>
                </div>
              </div>

              <ul className="divide-y divide-neutral-100">
                {order.items.map((item, index) => (
                  <li key={`${order.orderNumber}-${index}`} className="flex items-center gap-3 py-3">
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate font-medium text-neutral-900">{item.productName}</p>
                      <p className="text-xs text-neutral-500">
                        {item.size} • {item.colour} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <Link
                href={`/order/${order.orderNumber}/status`}
                className="mt-2 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                View order and delivery
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
