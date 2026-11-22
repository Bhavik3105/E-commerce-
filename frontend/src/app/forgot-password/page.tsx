'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { apiBase } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    const response = await fetch(`${apiBase()}/api/account/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    setSubmitting(false);
    if (!response.ok) {
      setError(body.message || 'The reset email could not be sent.');
      return;
    }
    setMessage(body.message || 'If an account exists for that email, a reset link is on its way.');
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-neutral-900">Reset your password</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter the email on your account. We’ll send a link to choose a new password. The link expires in 30 minutes.
        </p>

        {message ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">{message}</p>
            <Link href="/login" className="inline-flex text-sm font-medium text-primary-700 hover:text-primary-800">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-xs font-medium text-neutral-700">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </label>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send reset link'}
            </button>
            <Link href="/login" className="inline-flex text-sm font-medium text-primary-700 hover:text-primary-800">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
