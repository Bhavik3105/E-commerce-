/**
 * Format price from paise to INR display string.
 * Example: 149900 → "₹1,499.00"
 */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Calculate discount percentage.
 */
export function getDiscountPercent(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Generate a unique key for a cart item (product + variant).
 */
export function cartItemKey(productId: string, size: string, colour: string): string {
  return `${productId}__${size}__${colour}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * cn — merge Tailwind class names. Simple version without clsx/tailwind-merge.
 * Filters out falsy values and joins.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

