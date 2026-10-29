import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
        <span className="text-3xl font-extrabold">404</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-8">
        We couldn&apos;t find the garment or page you were looking for. It may have been moved, renamed, or is temporarily out of stock.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

