'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { apiBase } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statuses = [
  { value: 'not_shipped', label: 'Preparing to ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
] as const;

type ShipmentStatus = (typeof statuses)[number]['value'];

interface DeskItem {
  productName: string;
  productImage: string;
  size: string;
  colour: string;
  quantity: number;
  priceAtPurchase: number;
}

/** Order photos are saved with the API address from checkout. Show them from the current site. */
function orderImage(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url, apiBase() || 'http://localhost');
    if (!parsed.pathname.startsWith('/uploads/')) return url;
    const base = apiBase();
    return base ? `${base}${parsed.pathname}` : parsed.pathname;
  } catch {
    return url;
  }
}

interface DeskOrder {
  orderNumber: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  deliveryAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: DeskItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shipmentStatus: ShipmentStatus;
}

function statusLabel(value: ShipmentStatus): string {
  return statuses.find((status) => status.value === value)?.label ?? value;
}

function orderDate(value: string): string {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function OrderDesk({ token }: { token: string }) {
  const [orders, setOrders] = useState<DeskOrder[]>([]);
  const [choices, setChoices] = useState<Record<string, ShipmentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [printing, setPrinting] = useState<DeskOrder | null>(null);

  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    const finish = () => setPrinting(null);
    window.addEventListener('afterprint', finish);
    const timer = window.setTimeout(() => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('.order-print img'));
      Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              if (image.complete) {
                resolve();
                return;
              }
              image.onload = () => resolve();
              image.onerror = () => resolve();
            })
        )
      ).then(() => {
        if (!cancelled) window.print();
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('afterprint', finish);
    };
  }, [printing]);

  useEffect(() => {
    let active = true;
    fetch(`${apiBase()}/api/admin/orders`, {
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
    const response = await fetch(`${apiBase()}/api/admin/orders/${orderNumber}`, {
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
                  {orderDate(order.createdAt)}
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
            <ul className="mt-4 divide-y divide-neutral-100 border-t border-neutral-100">
              {order.items.map((item, index) => (
                <li key={`${order.orderNumber}-${index}`} className="flex items-center gap-3 py-3">
                  <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                    {item.productImage ? (
                      <img
                        src={orderImage(item.productImage)}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium text-neutral-900">{item.productName}</p>
                    <p className="text-xs text-neutral-500">
                      {item.size} · {item.colour} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatPrice(item.priceAtPurchase * item.quantity)}
                  </p>
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
              <button
                type="button"
                onClick={() => setPrinting(order)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800"
              >
                Print
              </button>
            </div>
          </article>
        ))
      )}
      {printing &&
        createPortal(
        <article className="order-print pointer-events-none fixed left-[-10000px] top-0 w-[800px] bg-white p-8 text-black">
          <p className="text-xs font-semibold uppercase tracking-wider">Jummip</p>
          <h1 className="mt-1 text-2xl font-bold">Order {printing.orderNumber}</h1>
          <p className="mt-1 text-sm">
            {orderDate(printing.createdAt)} · {statusLabel(printing.shipmentStatus)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <section>
              <h2 className="text-sm font-semibold">Customer</h2>
              <p className="mt-1 text-sm">{printing.customer.name}</p>
              <p className="text-sm">{printing.customer.email}</p>
              <p className="text-sm">+91 {printing.customer.phone}</p>
            </section>
            <section>
              <h2 className="text-sm font-semibold">Shipping</h2>
              <p className="mt-1 text-sm">{printing.deliveryAddress.line1}</p>
              {printing.deliveryAddress.line2 ? <p className="text-sm">{printing.deliveryAddress.line2}</p> : null}
              <p className="text-sm">
                {printing.deliveryAddress.city}, {printing.deliveryAddress.state} {printing.deliveryAddress.pincode}
              </p>
              <p className="mt-1 text-sm">Delivery charge {formatPrice(printing.shipping)}</p>
            </section>
          </div>

          <h2 className="mt-6 text-sm font-semibold">Products</h2>
          <ul className="mt-2 divide-y divide-neutral-300 border-y border-neutral-300">
            {printing.items.map((item, index) => (
              <li key={`${printing.orderNumber}-print-${index}`} className="flex items-center gap-3 py-3">
                <div className="h-16 w-12 flex-shrink-0 overflow-hidden bg-neutral-100">
                  {item.productImage ? (
                    <img src={orderImage(item.productImage)} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">{item.productName}</p>
                  <p>
                    Size {item.size} · Colour {item.colour} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.priceAtPurchase * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 ml-auto w-52 space-y-1 text-sm">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(printing.subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery</span>
              <span>{formatPrice(printing.shipping)}</span>
            </p>
            <p className="flex justify-between border-t border-neutral-300 pt-1 font-semibold">
              <span>Total</span>
              <span>{formatPrice(printing.total)}</span>
            </p>
          </div>
        </article>,
          document.body
        )}
    </div>
  );
}
