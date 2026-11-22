import { instagramReelCode, instagramReels } from '@/data/instagram';
import { siteConfig } from '@/lib/constants';

const reels = instagramReels
  .map((url) => {
    const code = instagramReelCode(url);
    return code ? { code, url } : null;
  })
  .filter((reel): reel is { code: string; url: string } => reel !== null);

export function InstagramReels() {
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel) => (
            <div key={reel.code} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card">
              <iframe
                src={`https://www.instagram.com/reel/${reel.code}/embed`}
                title={`Instagram reel ${reel.code}`}
                className="h-[540px] w-full"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
