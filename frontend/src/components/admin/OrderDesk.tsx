'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statuses = [
  { value: 'not_shipped', label: 'Preparing to ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
] as const;

type ShipmentStatus = (typeof statuses)[number]['value'];

interface DeskItem {
  productName: string;
  size: string;
  colour: string;
  quantity: number;
  priceAtPurchase: number;
}

interface DeskOrder {
  orderNumber: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  deliveryAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: DeskItem[];
  total: number;
  shipmentStatus: ShipmentStatus;
}

export function OrderDesk({ token }: { token: string }) {
  const [orders, setOrders] = useState<DeskOrder[]>([]);
  const [choices, setChoices] = useState<Record<string, ShipmentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${apiBase}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => ({}))) as { data?: DeskOrder[]; message?: string };
        if (!response.ok) throw new Error(body.message || 'Could not load orders');
        return body.data ?? [];
      })
      .then((data) => {
        if (!active) return;
        setOrders(data);
        setChoices(Object.fromEntries(data.map((order) => [order.orderNumber, order.shipmentStatus])));
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setMessage(err instanceof Error ? err.message : 'Could not load orders');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function save(orderNumber: string) {
    const shipmentStatus = choices[orderNumber];
    setSaving(orderNumber);
    setMessage('');
    const response = await fetch(`${apiBase}/api/admin/orders/${orderNumber}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipmentStatus }),
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: DeskOrder;
      emailed?: boolean;
      message?: string;
    };
    setSaving('');
    if (!response.ok || !body.data) {
      setMessage(body.message || 'Could not update the order');
      return;
    }
    setOrders((current) => current.map((order) => (order.orderNumber === orderNumber ? body.data! : order)));
    setMessage(
      body.emailed
        ? `${orderNumber} updated. The customer was emailed.`
        : `${orderNumber} updated. The customer can see this on their account.`
    );
  }

  if (loading) return <p className="mt-6 text-sm text-neutral-500">Loading orders…</p>;

  return (
    <div className="mt-6 space-y-4">
      {message && <p className="text-sm text-neutral-700">{message}</p>}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          No paid orders yet. A new order appears here after Razorpay confirms the payment.
        </div>
      ) : (
        orders.map((order) => (
          <article key={order.orderNumber} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-neutral-900">{order.orderNumber}</h2>
                <p className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' · '}
                  {order.customer.name} · {order.customer.email} · +91 {order.customer.phone}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {order.deliveryAddress.line1}
                  {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}, {order.deliveryAddress.city},{' '}
                  {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                </p>
              </div>
              <p className="font-semibold text-neutral-900">{formatPrice(order.total)}</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              {order.items.map((item, index) => (
                <li key={`${order.orderNumber}-${index}`}>
                  {item.productName} · {item.size} · {item.colour} · Qty {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-neutral-700">
                Delivery status
                <select
                  value={choices[order.orderNumber] ?? order.shipmentStatus}
                  onChange={(event) =>
                    setChoices((current) => ({
                      ...current,
                      [order.orderNumber]: event.target.value as ShipmentStatus,
                    }))
                  }
                  className="ml-2 rounded-lg border border-neutral-300 px-3 py-2"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={saving === order.orderNumber}
                onClick={() => void save(order.orderNumber)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving === order.orderNumber ? 'Saving…' : 'Save status'}
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
