'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from '@/lib/account-context';

function nextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/account';
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const destination = nextPath(params.get('next'));
  const { customer, ready, login, register } = useAccount();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && customer) router.replace(destination);
  }, [ready, customer, destination, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const message =
      mode === 'login'
        ? await login(email.trim(), password)
        : await register({
            name: name.trim(),
            email: email.trim(),
            phone: phone.replace(/\D/g, ''),
            password,
          });
    setSubmitting(false);
    if (message) {
      setError(message);
      return;
    }
    router.replace(destination);
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          {mode === 'login' ? 'Sign in' : 'Create an account'}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in before payment. After you pay, this account shows what you ordered and where the delivery stands.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <label className="block text-xs font-medium text-neutral-700">
                Full name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-xs font-medium text-neutral-700">
                Phone
                <input
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="10-digit mobile number"
                />
              </label>
            </>
          )}

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

          <label className="block text-xs font-medium text-neutral-700">
            Password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
            />
          </label>

          {mode === 'login' && (
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs font-medium text-primary-700 hover:text-primary-800">
                Forgot password?
              </Link>
            </div>
          )}

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm font-medium text-primary-700 hover:text-primary-800"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
        >
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
