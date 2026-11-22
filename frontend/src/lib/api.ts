/**
 * Where the browser or the server should call the API.
 * Locally, NEXT_PUBLIC_API_URL is http://localhost:5000.
 * On Vercel, the server uses BACKEND_URL injected by the frontend service binding.
 * The browser uses the same domain, and /api is rewritten to the backend.
 */
export function apiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (typeof window === 'undefined' && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/$/, '');
  }
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }
  return '';
}
