import { apiBase } from '@/lib/api';
import type { StoreReel } from '@/components/home/InstagramReels';

export interface StoreTestimonial {
  id: string;
  name: string;
  collection: string;
  quote: string;
}

export const sampleTestimonials: StoreTestimonial[] = [
  {
    id: 't1',
    name: 'Ananya M.',
    collection: 'T-Shirts',
    quote:
      'The cotton tee stays soft after washing and the fit is easy without looking oversized. It has become the shirt I reach for first.',
  },
  {
    id: 't2',
    name: 'Riya S.',
    collection: 'Nightsuits',
    quote:
      'Light enough for warm nights and still comfortable by morning. The waistband does not dig in, which is rare.',
  },
  {
    id: 't3',
    name: 'Meera K.',
    collection: 'Undergarments',
    quote: 'Everyday cotton that actually feels gentle. True to size, and it sits flat under a tee.',
  },
  {
    id: 't4',
    name: 'Kavya P.',
    collection: 'T-Shirts',
    quote: 'The neckline kept its shape and the fabric is not see-through. Simple, and that is exactly what I wanted.',
  },
  {
    id: 't5',
    name: 'Ishita R.',
    collection: 'Nightsuits',
    quote: 'I ordered the nightsuit set for travel. It folds small, washes well, and still looks neat.',
  },
  {
    id: 't6',
    name: 'Neha D.',
    collection: 'Undergarments',
    quote: 'Soft straps and a clean finish. Comfortable for a full day, not just the first wear.',
  },
];

export async function fetchTestimonials(): Promise<StoreTestimonial[]> {
  try {
    const response = await fetch(`${apiBase()}/api/testimonials`, { cache: 'no-store' });
    if (!response.ok) return sampleTestimonials;
    const body = (await response.json()) as { data?: StoreTestimonial[] };
    const saved = body.data ?? [];
    return saved.length > 0 ? saved : sampleTestimonials;
  } catch {
    return sampleTestimonials;
  }
}

export async function fetchReels(): Promise<StoreReel[]> {
  try {
    const response = await fetch(`${apiBase()}/api/reels`, { cache: 'no-store' });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: StoreReel[] };
    return body.data ?? [];
  } catch {
    return [];
  }
}
