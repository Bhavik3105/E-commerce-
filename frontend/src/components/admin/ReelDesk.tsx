'use client';

import { useEffect, useState } from 'react';
import { apiBase } from '@/lib/api';

interface DeskReel {
  id: string;
  url: string;
  code: string;
}

export function ReelDesk({ token }: { token: string }) {
  const [reels, setReels] = useState<DeskReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${apiBase()}/api/admin/reels`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => ({}))) as { data?: DeskReel[]; message?: string };
        if (!response.ok) throw new Error(body.message || 'Could not load reels');
        return body.data ?? [];
      })
      .then((data) => {
        if (!active) return;
        setReels(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setMessage(err instanceof Error ? err.message : 'Could not load reels');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const response = await fetch(`${apiBase()}/api/admin/reels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url }),
    });
    const body = (await response.json().catch(() => ({}))) as { data?: DeskReel; message?: string };
    setSaving(false);
    if (!response.ok || !body.data) {
      setMessage(body.message || 'Could not add the reel');
      return;
    }
    setReels((current) => [body.data!, ...current]);
    setUrl('');
    setMessage('Reel added. It plays on the homepage.');
  }

  async function remove(reel: DeskReel) {
    if (!window.confirm('Remove this reel from the homepage?')) return;
    setMessage('');
    const response = await fetch(`${apiBase()}/api/admin/reels/${reel.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(body.message || 'Could not remove the reel');
      return;
    }
    setReels((current) => current.filter((item) => item.id !== reel.id));
    setMessage('Reel removed.');
  }

  if (loading) return <p className="mt-6 text-sm text-neutral-500">Loading reels…</p>;

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-neutral-500">
        Open the reel in Instagram, copy its link, and paste it here. The reel plays on the homepage.
      </p>
      {message && <p className="text-sm text-neutral-700">{message}</p>}
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-neutral-900">Add a reel</h2>
        <label className="block text-sm font-medium text-neutral-700">
          Instagram reel link
          <input
            required
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.instagram.com/reel/..."
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          {saving ? 'Saving…' : 'Add reel'}
        </button>
      </form>

      {reels.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          No reels yet. The homepage shows a short note until you add one.
        </div>
      ) : (
        reels.map((reel) => (
          <article key={reel.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-neutral-900">Reel {reel.code}</h2>
                <a href={reel.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm text-primary-700">
                  {reel.url}
                </a>
              </div>
              <button
                type="button"
                onClick={() => void remove(reel)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
