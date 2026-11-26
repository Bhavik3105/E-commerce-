'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { apiBase } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statuses = [
  { value: 'not_shipped', label: 'Preparing to ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
] as const;

const cancelReasons = [
  { value: 'out_of_stock', label: 'The item is out of stock' },
  { value: 'unavailable', label: 'The item is no longer available' },
  { value: 'cannot_deliver', label: 'We cannot deliver to this address' },
  { value: 'customer_request', label: 'You asked us to cancel this order' },
  { value: 'payment_issue', label: 'There was a problem with the payment' },
] as const;

const refundNote = 'Your money will be refunded within 2 working days.';

const sorts = [
  { value: 'newest', label: 'Date, newest first' },
  { value: 'oldest', label: 'Date, oldest first' },
  { value: 'name-asc', label: 'Name, A to Z' },
  { value: 'name-desc', label: 'Name, Z to A' },
  { value: 'total-desc', label: 'Amount, high to low' },
  { value: 'total-asc', label: 'Amount, low to high' },
] as const;

const statusFilters = [
  { value: 'all', label: 'All orders' },
  { value: 'not_shipped', label: 'Preparing to ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

type SortKey = (typeof sorts)[number]['value'];
type StatusFilter = (typeof statusFilters)[number]['value'];

type ShipmentStatus = (typeof statuses)[number]['value'];
type CancelReason = (typeof cancelReasons)[number]['value'];

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
  orderStatus: string;
  shipmentStatus: ShipmentStatus;
  cancelReason: CancelReason | null;
  cancelReasonLabel: string | null;
  refundNote: string | null;
}

function statusLabel(value: ShipmentStatus): string {
  return statuses.find((status) => status.value === value)?.label ?? value;
}

function orderState(order: DeskOrder): StatusFilter {
  if (order.orderStatus === 'cancelled') return 'cancelled';
  return order.shipmentStatus;
}

function matchesQuery(order: DeskOrder, query: string): boolean {
  if (!query) return true;
  const haystack = [
    order.orderNumber,
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    order.deliveryAddress.city,
    order.deliveryAddress.state,
    order.deliveryAddress.pincode,
    ...order.items.map((item) => `${item.productName} ${item.size} ${item.colour}`),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
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
  const [cancelling, setCancelling] = useState('');
  const [cancelChoice, setCancelChoice] = useState<Record<string, CancelReason | ''>>({});
  const [message, setMessage] = useState('');
  const [printing, setPrinting] = useState<DeskOrder | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const visibleOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = orders.filter(
      (order) => (statusFilter === 'all' || orderState(order) === statusFilter) && matchesQuery(order, needle)
    );
    const sorted = [...filtered];
    sorted.sort((left, right) => {
      if (sort === 'oldest') return Date.parse(left.createdAt) - Date.parse(right.createdAt);
      if (sort === 'name-asc') return left.customer.name.localeCompare(right.customer.name);
      if (sort === 'name-desc') return right.customer.name.localeCompare(left.customer.name);
      if (sort === 'total-desc') return right.total - left.total;
      if (sort === 'total-asc') return left.total - right.total;
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    });
    return sorted;
  }, [orders, query, sort, statusFilter]);

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

  async function cancel(order: DeskOrder) {
    const reason = cancelChoice[order.orderNumber];
    const label = cancelReasons.find((entry) => entry.value === reason)?.label;
    if (!reason || !label) {
      setMessage('Choose why this order is being cancelled.');
      return;
    }
    if (!window.confirm(`Cancel ${order.orderNumber}? The customer will be told: ${label}. ${refundNote}`)) return;
    setCancelling(order.orderNumber);
    setMessage('');
    const response = await fetch(`${apiBase()}/api/admin/orders/${order.orderNumber}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: DeskOrder;
      emailed?: boolean;
      message?: string;
    };
    setCancelling('');
    if (!response.ok || !body.data) {
      setMessage(body.message || 'Could not cancel the order');
      return;
    }
    setOrders((current) => current.map((entry) => (entry.orderNumber === order.orderNumber ? body.data! : entry)));
    setMessage(
      body.emailed
        ? `${order.orderNumber} cancelled. The customer was emailed.`
        : `${order.orderNumber} cancelled. The customer can see the reason on their order.`
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
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-medium text-neutral-700">
              Search
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, order, city, product"
                className="mt-1 block w-56 rounded-lg border border-neutral-300 px-3 py-2 font-normal"
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Sort
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 font-normal"
              >
                {sorts.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Show
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 font-normal"
              >
                {statusFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="pb-2 text-sm text-neutral-500">
              {visibleOrders.length} of {orders.length}
            </p>
          </div>
          {visibleOrders.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
              No orders match this search or filter.
            </div>
          ) : (
            visibleOrders.map((order) => (
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
            {order.orderStatus === 'cancelled' ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <p className="font-semibold">Cancelled</p>
                <p className="mt-1">{order.cancelReasonLabel}</p>
                <p className="mt-1">{order.refundNote}</p>
              </div>
            ) : (
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
                <label className="text-sm font-medium text-neutral-700">
                  Cancel reason
                  <select
                    value={cancelChoice[order.orderNumber] ?? ''}
                    onChange={(event) =>
                      setCancelChoice((current) => ({
                        ...current,
                        [order.orderNumber]: event.target.value as CancelReason | '',
                      }))
                    }
                    className="ml-2 rounded-lg border border-neutral-300 px-3 py-2"
                  >
                    <option value="">Choose a reason</option>
                    {cancelReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={cancelling === order.orderNumber || !cancelChoice[order.orderNumber]}
                  onClick={() => void cancel(order)}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                >
                  {cancelling === order.orderNumber ? 'Cancelling…' : 'Cancel order'}
                </button>
              </div>
            )}
            <div className="mt-3">
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
        </>
      )}
      {printing &&
        createPortal(
        <article className="order-print pointer-events-none fixed left-[-10000px] top-0 w-[800px] bg-white p-8 text-black">
          <p className="text-xs font-semibold uppercase tracking-wider">Jummip</p>
          <h1 className="mt-1 text-2xl font-bold">Order {printing.orderNumber}</h1>
          <p className="mt-1 text-sm">
            {orderDate(printing.createdAt)} ·{' '}
            {printing.orderStatus === 'cancelled' ? 'Cancelled' : statusLabel(printing.shipmentStatus)}
            {printing.orderStatus === 'cancelled' && printing.cancelReasonLabel ? ` · ${printing.cancelReasonLabel}` : ''}
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
          {printing.orderStatus === 'cancelled' && printing.refundNote ? (
            <p className="mt-4 text-sm">{printing.refundNote}</p>
          ) : null}
        </article>,
          document.body
        )}
    </div>
  );
}
