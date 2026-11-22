'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from '@/lib/account-context';

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const { resetPassword } = useAccount();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setSubmitting(true);
    setError('');
    const message = await resetPassword(token, password);
    setSubmitting(false);
    if (message) {
      setError(message);
      return;
    }
    router.replace('/account');
  }

  if (!token) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-neutral-900">Reset link missing</h1>
          <p className="mt-2 text-sm text-neutral-500">Open the reset link from your email, or request a new one.</p>
          <Link href="/forgot-password" className="mt-6 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-neutral-900">Choose a new password</h1>
        <p className="mt-2 text-sm text-neutral-500">Use at least 8 characters. This replaces the password on your account.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-medium text-neutral-700">
            New password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-700">
            Confirm password
            <input
              required
              type="password"
              minLength={8}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Repeat the new password"
            />
          </label>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
