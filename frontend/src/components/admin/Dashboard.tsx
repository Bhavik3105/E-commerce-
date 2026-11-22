'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Category, Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { pageSections } from '@/lib/dashboard';
import { OrderDesk } from '@/components/admin/OrderDesk';
import { apiBase } from '@/lib/api';
const tokenKey = 'jummip-admin-token';

type VariantDraft = { size: string; colour: string; colourHex: string; stock: string };

type Draft = {
  name: string;
  description: string;
  categorySlug: string;
  price: string;
  salePrice: string;
  imageUrl: string;
  showOnHome: boolean;
  isActive: boolean;
  variants: VariantDraft[];
};

const emptyVariant = (): VariantDraft => ({
  size: 'M',
  colour: 'White',
  colourHex: '#FFFFFF',
  stock: '10',
});

function emptyDraft(section: string, fallbackSlug = ''): Draft {
  const collection = section !== 'home' && section !== 'shop' ? section : fallbackSlug;
  return {
    name: '',
    description: '',
    categorySlug: collection,
    price: '',
    salePrice: '',
    imageUrl: '',
    showOnHome: section === 'home',
    isActive: true,
    variants: [emptyVariant()],
  };
}

function draftFromProduct(product: Product): Draft {
  return {
    name: product.name,
    description: product.description,
    categorySlug: product.categorySlug,
    price: String(product.price / 100),
    salePrice: product.salePrice ? String(product.salePrice / 100) : '',
    imageUrl: product.images[0]?.url ?? '',
    showOnHome: Boolean(product.showOnHome),
    isActive: product.isActive,
    variants: product.variants.map((variant) => ({
      size: variant.size,
      colour: variant.colour,
      colourHex: variant.colourHex,
      stock: String(variant.stock),
    })),
  };
}

function PhotoField({
  value,
  onChange,
  token,
  onMessage,
}: {
  value: string;
  onChange: (url: string) => void;
  token: string;
  onMessage: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    onMessage('');
    const body = new FormData();
    body.append('photo', file);
    const response = await fetch(`${apiBase()}/api/admin/uploads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const payload = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
    setUploading(false);
    if (!response.ok || !payload.url) {
      onMessage(payload.message || 'Could not upload the photo');
      return;
    }
    onChange(payload.url);
  }

  return (
    <div className="block text-sm font-medium text-neutral-700">
      Photo
      <div className="mt-2 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400">
            None
          </div>
        )}
        <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={onFile}
          />
          {uploading ? 'Uploading…' : 'Upload photo'}
        </label>
      </div>
      <p className="mt-2 text-xs font-normal text-neutral-500">JPG, PNG, or WEBP, up to 5 MB.</p>
      <input
        required
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal"
        placeholder="Or paste an image address"
      />
    </div>
  );
}

function pageHref(section: string): string {
  if (section === 'home') return '/';
  if (section === 'shop') return '/products';
  return `/category/${section}`;
}

export function Dashboard({ section }: { section: string }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Category[]>([]);
  const [collectionsReady, setCollectionsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingCollection, setAddingCollection] = useState(false);
  const [collectionDraft, setCollectionDraft] = useState({ name: '', description: '', imageUrl: '' });
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(section));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem(tokenKey));
    setReady(true);
  }, []);

  useEffect(() => {
    setCreating(false);
    setEditing(null);
    setAddingCollection(false);
    setDraft(emptyDraft(section));
    setMessage('');
    setFormError('');
  }, [section]);

  async function loadProducts(activeToken: string) {
    setLoading(true);
    const response = await fetch(`${apiBase()}/api/admin/products`, {
      headers: { Authorization: `Bearer ${activeToken}` },
      cache: 'no-store',
    });
    if (response.status === 401) {
      sessionStorage.removeItem(tokenKey);
      setToken(null);
      setLoading(false);
      return;
    }
    const body = (await response.json()) as { data?: Product[]; message?: string };
    setProducts(body.data ?? []);
    setLoading(false);
    if (!response.ok) setMessage(body.message || 'Could not load products');
  }

  async function loadCollections() {
    const response = await fetch(`${apiBase()}/api/categories`, { cache: 'no-store' });
    const body = (await response.json()) as { data?: Category[] };
    setCollections(body.data ?? []);
    setCollectionsReady(true);
  }

  useEffect(() => {
    if (!token) return;
    void loadProducts(token);
    void loadCollections();
  }, [token]);

  const visible = useMemo(() => {
    if (section === 'home') return products.filter((product) => product.isActive && product.showOnHome);
    if (section === 'shop') return products.filter((product) => product.isActive);
    return products.filter((product) => product.categorySlug === section);
  }, [products, section]);

  function countFor(id: string) {
    if (id === 'home') return products.filter((product) => product.isActive && product.showOnHome).length;
    if (id === 'shop') return products.filter((product) => product.isActive).length;
    return products.filter((product) => product.categorySlug === id).length;
  }

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setLoginError('');
    const response = await fetch(`${apiBase()}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const body = (await response.json()) as { token?: string; message?: string };
    if (!response.ok || !body.token) {
      setLoginError(body.message || 'Could not sign in');
      return;
    }
    sessionStorage.setItem(tokenKey, body.token);
    setToken(body.token);
    setPassword('');
  }

  function startCreate() {
    setEditing(null);
    setAddingCollection(false);
    setDraft(emptyDraft(section, collections[0]?.slug ?? ''));
    setCreating(true);
    setMessage('');
    setFormError('');
  }

  function startCollection() {
    setCreating(false);
    setEditing(null);
    setAddingCollection(true);
    setCollectionDraft({ name: '', description: '', imageUrl: '' });
    setMessage('');
  }

  async function saveCollection(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage('');
    const response = await fetch(`${apiBase()}/api/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(collectionDraft),
    });
    const body = (await response.json()) as { data?: Category; message?: string };
    setSaving(false);
    if (!response.ok || !body.data) {
      setMessage(body.message || 'Could not add the collection');
      return;
    }
    setCollections((current) =>
      current.some((item) => item.slug === body.data?.slug) ? current : [...current, body.data as Category]
    );
    setAddingCollection(false);
    router.push(`/admin/${body.data.slug}`);
    router.refresh();
  }

  async function removeCollection() {
    if (!token || !collection) return;
    const count = countFor(collection.slug);
    const productNote =
      count === 0
        ? 'It has no products.'
        : `${count} ${count === 1 ? 'product' : 'products'} in it will also be removed from the store.`;
    if (!window.confirm(`Delete ${collection.name}? ${productNote}`)) return;
    const response = await fetch(`${apiBase()}/api/admin/categories/${collection.slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setMessage(body.message || 'Could not delete the collection');
      return;
    }
    setCollections((current) => current.filter((item) => item.slug !== collection.slug));
    setProducts((current) => current.filter((product) => product.categorySlug !== collection.slug));
    setCreating(false);
    setEditing(null);
    router.push('/admin/home');
  }

  function startEdit(product: Product) {
    setCreating(false);
    setEditing(product);
    setDraft(draftFromProduct(product));
    setMessage('');
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage('');
    setFormError('');
    const price = Number(draft.price);
    const enteredSale = draft.salePrice.trim() ? Number(draft.salePrice) : null;
    if (enteredSale !== null && (!Number.isFinite(enteredSale) || enteredSale <= 0)) {
      setSaving(false);
      setFormError('Enter the sale price as a number, or leave it empty.');
      return;
    }
    if (enteredSale !== null && enteredSale > price) {
      setSaving(false);
      setFormError('The sale price must be lower than the regular price. Leave it empty if this product is not on sale.');
      return;
    }
    const payload = {
      name: draft.name,
      description: draft.description,
      categorySlug: section !== 'home' && section !== 'shop' ? section : draft.categorySlug,
      priceRupees: price,
      salePriceRupees: enteredSale !== null && enteredSale < price ? enteredSale : null,
      imageUrl: draft.imageUrl,
      showOnHome: draft.showOnHome,
      isActive: draft.isActive,
      variants: draft.variants.map((variant) => ({
        size: variant.size,
        colour: variant.colour,
        colourHex: variant.colourHex,
        stock: Number(variant.stock),
      })),
    };
    const response = await fetch(
      editing ? `${apiBase()}/api/admin/products/${editing.id}` : `${apiBase()}/api/admin/products`,
      {
        method: editing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    setSaving(false);
    if (!response.ok) {
      setFormError(body.message || 'Could not save the product');
      return;
    }
    setCreating(false);
    setEditing(null);
    setMessage(editing ? 'Product updated. The store pages use this catalogue.' : 'Product added. The store pages use this catalogue.');
    await loadProducts(token);
  }

  async function remove(product: Product) {
    if (!token) return;
    if (!window.confirm(`Delete ${product.name}? It will leave the home page, Shop All, and its collection.`)) return;
    const response = await fetch(`${apiBase()}/api/admin/products/${product.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok && response.status !== 204) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(body.message || 'Could not delete the product');
      return;
    }
    setMessage(`${product.name} was deleted.`);
    if (editing?.id === product.id) setEditing(null);
    await loadProducts(token);
  }

  if (!ready) return <div className="min-h-screen bg-neutral-100" />;

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Jummip</p>
            <h1 className="mt-1 text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="mt-2 text-sm text-neutral-500">Sign in to add and edit products for the store pages.</p>
          </div>
          <label className="block text-sm font-medium text-neutral-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              autoFocus
              required
            />
          </label>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const isOrders = section === 'orders';
  const page = pageSections.find((item) => item.id === section);
  const collection = collections.find((item) => item.slug === section);
  const current = page ?? (collection
    ? {
        label: collection.name,
        blurb: `The ${collection.name} collection page. These products are included in Shop All.`,
      }
    : collectionsReady
      ? null
      : { label: 'Collection', blurb: 'Loading this collection…' });
  const collectionLocked = Boolean(collection);
  const formOpen = creating || editing;

  return (
    <div className="min-h-screen bg-neutral-100 md:grid md:grid-cols-[250px_1fr]">
      <aside className="bg-neutral-950 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-300">Jummip</p>
          <p className="mt-1 text-lg font-bold">Product pages</p>
        </div>
        <div className="px-3 pb-4">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Pages</p>
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin/orders"
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                  isOrders ? 'bg-white text-neutral-950' : 'text-neutral-200 hover:bg-white/10'
                }`}
              >
                <span>Orders</span>
              </Link>
            </li>
            {pageSections.map((item) => {
              const active = item.id === section;
              return (
                <li key={item.id}>
                  <Link
                    href={`/admin/${item.id}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                      active ? 'bg-white text-neutral-950' : 'text-neutral-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-xs ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>{countFor(item.id)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="px-3 pb-4">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Collections</p>
          <ul className="space-y-1">
            {collections.map((item) => {
              const active = item.slug === section;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/admin/${item.slug}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                      active ? 'bg-white text-neutral-950' : 'text-neutral-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`text-xs ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>{countFor(item.slug)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={startCollection}
            className="mt-3 w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Add collection
          </button>
        </div>
        {!isOrders && (
          <div className="px-5 py-4">
            <Link href={pageHref(section)} className="text-sm text-primary-300 hover:text-white">
              Open this store page
            </Link>
          </div>
        )}
      </aside>

      <section className="px-4 py-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{isOrders ? 'Orders' : current?.label ?? 'Collection'}</h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              {isOrders
                ? 'Change the delivery status after a payment. The customer sees it on their account and receives an email.'
                : current?.blurb ?? 'This collection is not on the store yet. Add it from the sidebar.'}
            </p>
          </div>
          {!isOrders && (
            <div className="flex flex-wrap gap-2">
              {collection && (
                <button
                  type="button"
                  onClick={() => void removeCollection()}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete collection
                </button>
              )}
              <button
                type="button"
                onClick={startCreate}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add product
              </button>
            </div>
          )}
        </div>

        {isOrders ? (
          <OrderDesk token={token} />
        ) : (
          <>
        {message && <p className="mt-4 text-sm text-neutral-700">{message}</p>}

        {addingCollection && (
          <form onSubmit={saveCollection} className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-neutral-900">New collection</h2>
            <p className="text-sm text-neutral-500">
              This adds a collection page, a home row, a shop filter, and a footer link. Products can be added after it is created.
            </p>
            <label className="block text-sm font-medium text-neutral-700">
              Name
              <input
                required
                minLength={2}
                value={collectionDraft.name}
                onChange={(event) => setCollectionDraft({ ...collectionDraft, name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                placeholder="Izaar"
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Description
              <textarea
                required
                minLength={10}
                value={collectionDraft.description}
                onChange={(event) => setCollectionDraft({ ...collectionDraft, description: event.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                rows={3}
              />
            </label>
            <PhotoField
              value={collectionDraft.imageUrl}
              token={token ?? ''}
              onMessage={setMessage}
              onChange={(imageUrl) => setCollectionDraft({ ...collectionDraft, imageUrl })}
            />
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                {saving ? 'Saving…' : 'Create collection'}
              </button>
              <button type="button" onClick={() => setAddingCollection(false)} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600">
                Cancel
              </button>
            </div>
          </form>
        )}

        {formOpen && (
          <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-neutral-900">{editing ? `Edit ${editing.name}` : 'New product'}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">
                Name
                <input
                  required
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Collection page
                <select
                  value={draft.categorySlug}
                  disabled={collectionLocked}
                  onChange={(event) => setDraft({ ...draft, categorySlug: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 disabled:bg-neutral-100"
                >
                  {collections.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium text-neutral-700">
              Description
              <textarea
                required
                minLength={10}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                rows={3}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">
                Price (₹)
                <input
                  required
                  inputMode="decimal"
                  value={draft.price}
                  onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Sale price (₹)
                <input
                  inputMode="decimal"
                  value={draft.salePrice}
                  onChange={(event) => setDraft({ ...draft, salePrice: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                  placeholder="Optional"
                />
              </label>
            </div>
            <PhotoField
              value={draft.imageUrl}
              token={token ?? ''}
              onMessage={setMessage}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-700">Sizes and colours</p>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, variants: [...draft.variants, emptyVariant()] })}
                  className="text-sm font-semibold text-primary-700"
                >
                  Add size
                </button>
              </div>
              {draft.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto_1fr_auto]">
                  <input
                    aria-label="Size"
                    value={variant.size}
                    onChange={(event) => updateVariant(index, { size: event.target.value })}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    placeholder="Size"
                    required
                  />
                  <input
                    aria-label="Colour"
                    value={variant.colour}
                    onChange={(event) => updateVariant(index, { colour: event.target.value })}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    placeholder="Colour"
                    required
                  />
                  <input
                    aria-label="Colour hex"
                    type="color"
                    value={variant.colourHex}
                    onChange={(event) => updateVariant(index, { colourHex: event.target.value })}
                    className="h-10 w-14 rounded-lg border border-neutral-300 bg-white"
                  />
                  <input
                    aria-label="Stock"
                    inputMode="numeric"
                    value={variant.stock}
                    onChange={(event) => updateVariant(index, { stock: event.target.value })}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    placeholder="Stock"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        variants: draft.variants.length === 1 ? draft.variants : draft.variants.filter((_, i) => i !== index),
                      })
                    }
                    className="text-sm text-neutral-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={draft.showOnHome}
                onChange={(event) => setDraft({ ...draft, showOnHome: event.target.checked })}
              />
              Show on the home page, in this collection’s row
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
              />
              Show in Shop All and on the collection page
            </label>

            {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                {saving ? 'Saving…' : 'Save product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="rounded-lg px-4 py-2 text-sm text-neutral-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {loading ? (
            <p className="p-6 text-sm text-neutral-500">Loading products…</p>
          ) : visible.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500">No products in this section yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {visible.map((product) => (
                <li key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-900">{product.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatPrice(product.salePrice || product.price)}
                      {product.salePrice ? ` · was ${formatPrice(product.price)}` : ''}
                      {' · '}
                      {product.category}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {[
                        product.showOnHome ? 'Home' : null,
                        product.isActive ? 'Shop All' : 'Hidden from shop',
                        product.category,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(product)} className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(product)} className="rounded-lg px-3 py-1.5 text-sm text-red-600">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
          </>
        )}
      </section>
    </div>
  );

  function updateVariant(index: number, patch: Partial<VariantDraft>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      variants: currentDraft.variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)),
    }));
  }
}
