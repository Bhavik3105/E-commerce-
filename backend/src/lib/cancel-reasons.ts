export const cancelReasons = [
  { value: 'out_of_stock', label: 'The item is out of stock' },
  { value: 'unavailable', label: 'The item is no longer available' },
  { value: 'cannot_deliver', label: 'We cannot deliver to this address' },
  { value: 'customer_request', label: 'You asked us to cancel this order' },
  { value: 'payment_issue', label: 'There was a problem with the payment' },
] as const;

export const cancelReasonValues = cancelReasons.map((reason) => reason.value) as [
  (typeof cancelReasons)[number]['value'],
  ...(typeof cancelReasons)[number]['value'][],
];

export const refundNote = 'Your money will be refunded within 2 working days.';

export function cancelReasonLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return cancelReasons.find((reason) => reason.value === value)?.label ?? null;
}
