'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { apiBase } from '@/lib/api';

const storageKey = 'jummip-account-token';

export interface AccountCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AccountContextValue {
  ready: boolean;
  customer: AccountCustomer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (input: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  resetPassword: (token: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

async function readError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => ({}))) as { message?: string };
  return body.message || 'Something went wrong. Please try again.';
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<AccountCustomer | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setReady(true);
      return;
    }
    let active = true;
    fetch(`${apiBase()}/api/account/me`, {
      headers: { Authorization: `Bearer ${saved}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const body = (await response.json()) as { data?: AccountCustomer };
        return body.data ?? null;
      })
      .then((data) => {
        if (!active) return;
        if (data) {
          setToken(saved);
          setCustomer(data);
        } else {
          window.localStorage.removeItem(storageKey);
        }
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function openSession(path: string, payload: unknown): Promise<string | null> {
    const response = await fetch(`${apiBase()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return readError(response);
    const body = (await response.json()) as { token?: string; data?: AccountCustomer };
    if (!body.token || !body.data) return 'The account could not be opened.';
    window.localStorage.setItem(storageKey, body.token);
    setToken(body.token);
    setCustomer(body.data);
    return null;
  }

  const value: AccountContextValue = {
    ready,
    customer,
    token,
    login: (email, password) => openSession('/api/account/login', { email, password }),
    register: (input) => openSession('/api/account/register', input),
    resetPassword: (token, password) => openSession('/api/account/reset-password', { token, password }),
    logout: () => {
      window.localStorage.removeItem(storageKey);
      setToken(null);
      setCustomer(null);
    },
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const value = useContext(AccountContext);
  if (!value) throw new Error('useAccount must be used within AccountProvider');
  return value;
}
