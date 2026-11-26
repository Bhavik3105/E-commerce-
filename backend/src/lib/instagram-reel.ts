export function instagramReelCode(url: string): string | null {
  const match = url.trim().match(/instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}
