'use client';

import { useEffect, useState } from 'react';
import type { StoreTestimonial } from '@/lib/testimonials';

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-primary-500" aria-hidden="true">
          <path d="M10 1.8 12.4 7l5.6.5-4.2 3.7 1.3 5.5L10 13.9 4.9 16.7l1.3-5.5L2 7.5 7.6 7 10 1.8Z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteCard({ item, featured = false }: { item: StoreTestimonial; featured?: boolean }) {
  return (
    <figure
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_50px_-24px_rgba(22,165,53,0.45)] ${
        featured ? 'sm:p-8' : ''
      }`}
    >
      <div className="pointer-events-none absolute -right-6 -top-8 font-serif text-8xl leading-none text-primary-100 transition duration-500 group-hover:text-primary-200">
        “
      </div>
      <div className="relative space-y-4">
        <Stars />
        <blockquote className={`text-neutral-800 ${featured ? 'text-lg leading-relaxed sm:text-xl' : 'text-sm leading-relaxed'}`}>
          {item.quote}
        </blockquote>
      </div>
      <figcaption className="relative mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-800">
          {item.name.slice(0, 1)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-neutral-900">{item.name}</span>
          <span className="block text-xs text-neutral-500">{item.collection}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: StoreTestimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = items.slice(0, 3);
  const current = featured[active] ?? featured[0];
  const supporting = current ? featured.filter((item) => item.id !== current.id) : [];

  useEffect(() => {
    if (paused || featured.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % featured.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [paused, featured.length]);

  if (!current) return null;

  return (
    <section className="relative overflow-hidden bg-neutral-900 py-16 text-white sm:py-20" aria-labelledby="testimonials-heading">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary-300/10 blur-3xl" />

      <div className="container relative space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-300">Customer notes</p>
            <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comfort, in their words
            </h2>
            <p className="text-sm leading-relaxed text-neutral-300">
              Notes from women who wear Jummip tees, nightsuits and everyday cotton.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Stars />
            <span className="text-sm text-neutral-200">Loved for everyday cotton</span>
          </div>
        </div>

        <div
          className="grid items-stretch gap-4 lg:grid-cols-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="lg:col-span-3">
            <div key={current.id} className="animate-fadeIn h-full text-neutral-900">
              <QuoteCard item={current} featured />
            </div>
            <div className="mt-4 flex items-center gap-2">
              {featured.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show review from ${item.name}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === active ? 'w-10 bg-primary-400' : 'w-4 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 text-neutral-900 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {supporting.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(items.findIndex((entry) => entry.id === item.id))}
                className="h-full text-left"
              >
                <QuoteCard item={item} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="marquee mt-12">
        <div className="marquee-track gap-4 px-4">
          {[...items, ...items].map((item, index) => (
            <figure
              key={`${item.id}-${index}`}
              className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm sm:w-[340px]"
            >
              <blockquote className="line-clamp-3 text-sm leading-relaxed text-neutral-100">“{item.quote}”</blockquote>
              <figcaption className="mt-3 text-xs font-medium text-primary-200">
                {item.name} · {item.collection}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
