/** Same rule the storefront already shows: ₹2 below ₹999, free from ₹999. Amounts are paise. */
export const FREE_SHIPPING_THRESHOLD = 99900;
export const SHIPPING_CHARGE = 200;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
}
