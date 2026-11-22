/**
 * Paste public Reel links here. Each new line is one Reel on the homepage.
 *
 * How to copy a link:
 * 1. Open the Reel in a browser (the account must be public).
 * 2. Click the three dots on the Reel, then Copy link.
 * 3. Paste the full link below.
 *
 * Example:
 * 'https://www.instagram.com/reel/AbCdEfGhIjK/'
 */
export const instagramReels: string[] = [];

export function instagramReelCode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}
