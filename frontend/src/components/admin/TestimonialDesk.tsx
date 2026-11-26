'use client';

import { useEffect, useState } from 'react';
import { apiBase } from '@/lib/api';
import type { StoreTestimonial } from '@/lib/testimonials';

const emptyDraft = { name: '', collection: '', quote: '' };

export function TestimonialDesk({ token, collections }: { token: string; collections: string[] }) {
  const [notes, setNotes] = useState<StoreTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${apiBase()}/api/admin/testimonials`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => ({}))) as { data?: StoreTestimonial[]; message?: string };
        if (!response.ok) throw new Error(body.message || 'Could not load testimonials');
        return body.data ?? [];
      })
      .then((data) => {
        if (!active) return;
        setNotes(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setMessage(err instanceof Error ? err.message : 'Could not load testimonials');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  function startEdit(note: StoreTestimonial) {
    setEditingId(note.id);
    setDraft({ name: note.name, collection: note.collection, quote: note.quote });
    setMessage('');
  }

  function cancelEdit() {
    setEditingId('');
    setDraft(emptyDraft);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const response = await fetch(
      editingId ? `${apiBase()}/api/admin/testimonials/${editingId}` : `${apiBase()}/api/admin/testimonials`,
      {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      }
    );
    const body = (await response.json().catch(() => ({}))) as { data?: StoreTestimonial; message?: string };
    setSaving(false);
    if (!response.ok || !body.data) {
      setMessage(body.message || 'Could not save the testimonial');
      return;
    }
    const saved = body.data;
    const wasEditing = Boolean(editingId);
    setNotes((current) => (wasEditing ? current.map((note) => (note.id === saved.id ? saved : note)) : [saved, ...current]));
    cancelEdit();
    setMessage(wasEditing ? 'Testimonial updated. It is on the homepage.' : 'Testimonial added. It is on the homepage.');
  }

  async function remove(note: StoreTestimonial) {
    if (!window.confirm(`Remove the note from ${note.name}?`)) return;
    setMessage('');
    const response = await fetch(`${apiBase()}/api/admin/testimonials/${note.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(body.message || 'Could not remove the testimonial');
      return;
    }
    setNotes((current) => current.filter((item) => item.id !== note.id));
    if (editingId === note.id) cancelEdit();
    setMessage('Testimonial removed.');
  }

  if (loading) return <p className="mt-6 text-sm text-neutral-500">Loading testimonials…</p>;

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-neutral-500">
        The homepage shows sample notes until you add one here. Notes you save replace those samples.
      </p>
      {message && <p className="text-sm text-neutral-700">{message}</p>}
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-neutral-900">{editingId ? 'Edit testimonial' : 'New testimonial'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-neutral-700">
            Customer name
            <input
              required
              minLength={2}
              maxLength={60}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal"
              placeholder="Ananya M."
            />
          </label>
          <label className="block text-sm font-medium text-neutral-700">
            Collection
            <input
              required
              minLength={2}
              maxLength={40}
              list="testimonial-collections"
              value={draft.collection}
              onChange={(event) => setDraft({ ...draft, collection: event.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal"
              placeholder="T-Shirts"
            />
            <datalist id="testimonial-collections">
              {collections.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </label>
        </div>
        <label className="block text-sm font-medium text-neutral-700">
          What they said
          <textarea
            required
            minLength={10}
            maxLength={400}
            rows={4}
            value={draft.quote}
            onChange={(event) => setDraft({ ...draft, quote: event.target.value })}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            {saving ? 'Saving…' : editingId ? 'Save testimonial' : 'Add testimonial'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600">
              Cancel
            </button>
          )}
        </div>
      </form>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          No saved testimonials yet.
        </div>
      ) : (
        notes.map((note) => (
          <article key={note.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-neutral-900">{note.name}</h2>
                <p className="text-xs text-neutral-500">{note.collection}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(note)}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(note)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">{note.quote}</p>
          </article>
        ))
      )}
    </div>
  );
}
