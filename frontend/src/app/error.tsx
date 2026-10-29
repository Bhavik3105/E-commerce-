'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error:', error);
  }, [error]);

  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-8">
        We encountered an unexpected error while loading this page. Please try refreshing or return to the storefront.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
