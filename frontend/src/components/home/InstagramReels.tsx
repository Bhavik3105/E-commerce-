'use client';

import { useRef } from 'react';
import { siteConfig } from '@/lib/constants';

export interface StoreReel {
  id: string;
  url: string;
  code: string;
}

export function InstagramReels({ reels }: { reels: StoreReel[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0, left: 0 });

  function touchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    drag.current = { x: touch.clientX, y: touch.clientY, left: scroller.current?.scrollLeft ?? 0 };
  }

  function touchMove(event: React.TouchEvent) {
    const scrollerNode = scroller.current;
    if (!scrollerNode) return;
    const touch = event.touches[0];
    const dx = drag.current.x - touch.clientX;
    const dy = drag.current.y - touch.clientY;
    if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
    scrollerNode.scrollLeft = drag.current.left + dx;
  }

  function touchEnd() {
    const scrollerNode = scroller.current;
    if (!scrollerNode || scrollerNode.clientWidth === 0) return;
    const index = Math.round(scrollerNode.scrollLeft / scrollerNode.clientWidth);
    const next = Math.min(Math.max(index, 0), reels.length - 1);
    scrollerNode.scrollTo({ left: next * scrollerNode.clientWidth, behavior: 'smooth' });
  }

  return (
    <section className="container space-y-6" aria-labelledby="instagram-reels-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-700">Instagram</p>
          <h2 id="instagram-reels-heading" className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Reels from the studio
          </h2>
          <p className="text-sm text-neutral-500">
            Watch the latest Jummip reels. They play from Instagram, on this page.
          </p>
        </div>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-primary-300 hover:text-primary-700"
        >
          Follow on Instagram
        </a>
      </div>

      {reels.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-card">
          <p className="text-base font-semibold text-neutral-900">New reels are on Instagram</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500">
            Follow Jummip to watch fabric, fit and new arrivals.
          </p>
        </div>
      ) : (
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {reels.map((reel) => (
            <div key={reel.code} className="min-w-full snap-start lg:min-w-0">
              <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-card">
                <iframe
                  src={`https://www.instagram.com/reel/${reel.code}/embed`}
                  title={`Instagram reel ${reel.code}`}
                  scrolling="no"
                  className="absolute left-1/2 top-[-54px] h-[calc(100%+220px)] w-[148%] max-w-none -translate-x-1/2 border-0"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
                <div className="absolute inset-x-0 top-0 z-10 h-[42%] lg:hidden" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} />
                <div className="absolute inset-x-0 bottom-0 z-10 h-[42%] lg:hidden" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} />
                <div className="absolute left-0 top-[42%] z-10 h-[16%] w-[38%] lg:hidden" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} />
                <div className="absolute right-0 top-[42%] z-10 h-[16%] w-[38%] lg:hidden" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
