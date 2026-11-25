import nodemailer from 'nodemailer';
import { config } from '../config';

export function mailConfigured(): boolean {
  return Boolean(config.smtpHost && config.smtpUser && config.smtpPass && config.mailFrom);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const deliveryTime =
  'We pack the order within 24 to 48 hours, excluding Sundays and national holidays. After it ships, delivery usually takes 4 to 7 business days. Metro cities are often 2 to 4 business days.';

export type MailOrder = {
  orderNumber: string;
  customer?: { name: string; email: string; phone: string } | null;
  deliveryAddress?: { line1: string; line2?: string | null; city: string; state: string; pincode: string } | null;
  items: Array<{ productName: string; size: string; colour: string; quantity: number; priceAtPurchase: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  shipmentStatus: string;
};

function rupees(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function deliveryLabel(status: string): string {
  if (status === 'shipped') return 'Shipped';
  if (status === 'delivered') return 'Delivered';
  return 'Preparing to ship';
}

async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
  await transport.sendMail({
    from: config.mailFrom,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

export async function sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }): Promise<void> {
  const name = escapeHtml(input.name);
  const url = escapeHtml(input.resetUrl);
  await sendMail({
    to: input.to,
    subject: 'Reset your Jummip password',
    text: [
      `Hello ${input.name},`,
      '',
      'We received a request to reset the password for your Jummip account.',
      '',
      'Choose a new password. This link expires in 30 minutes and can be used once:',
      input.resetUrl,
      '',
      "If you didn't ask for this, ignore this email. Your password will stay the same.",
      '',
      'Jummip',
    ].join('\n'),
    html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5;max-width:480px">
      <p>Hello ${name},</p>
      <p>We received a request to reset the password for your Jummip account.</p>
      <p><a href="${url}" style="display:inline-block;background:#0d8428;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">Choose a new password</a></p>
      <p style="font-size:13px;color:#525252">This link expires in 30 minutes and can be used once. If you didn't ask for this, ignore this email. Your password will stay the same.</p>
      <p style="font-size:13px;color:#737373">Jummip</p>
    </div>`,
  });
}

export async function sendOrderPlacedEmail(order: MailOrder): Promise<void> {
  if (!order.customer?.email || !order.deliveryAddress) return;
  const customer = order.customer;
  const deliveryAddress = order.deliveryAddress;
  const orderUrl = `${config.storeUrl}/order/${encodeURIComponent(order.orderNumber)}/status`;
  const address = [
    deliveryAddress.line1,
    deliveryAddress.line2,
    `${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`,
  ]
    .filter(Boolean)
    .join(', ');
  const itemLines = order.items.map(
    (item) =>
      `${item.productName} — ${item.size}, ${item.colour}, qty ${item.quantity} — ${rupees(item.priceAtPurchase * item.quantity)}`
  );
  const itemHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5">${escapeHtml(item.productName)}<br><span style="color:#525252;font-size:13px">${escapeHtml(item.size)} · ${escapeHtml(item.colour)} · Qty ${item.quantity}</span></td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right">${escapeHtml(rupees(item.priceAtPurchase * item.quantity))}</td></tr>`
    )
    .join('');
  await sendMail({
    to: customer.email,
    subject: `Your Jummip order ${order.orderNumber} is confirmed`,
    text: [
      `Hello ${customer.name},`,
      '',
      `Payment is confirmed for order ${order.orderNumber}.`,
      '',
      'Products:',
      ...itemLines,
      '',
      `Subtotal: ${rupees(order.subtotal)}`,
      `Delivery: ${order.shipping === 0 ? 'FREE' : rupees(order.shipping)}`,
      `Total: ${rupees(order.total)}`,
      '',
      `Deliver to: ${address}`,
      `Phone: +91 ${customer.phone}`,
      '',
      deliveryTime,
      '',
      `Current status: ${deliveryLabel(order.shipmentStatus)}`,
      `View this order: ${orderUrl}`,
      '',
      'Jummip',
    ].join('\n'),
    html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5;max-width:520px">
      <p>Hello ${escapeHtml(customer.name)},</p>
      <p>Payment is confirmed for order <strong>${escapeHtml(order.orderNumber)}</strong>.</p>
      <table style="width:100%;border-collapse:collapse">${itemHtml}</table>
      <p style="font-size:14px">Subtotal ${escapeHtml(rupees(order.subtotal))}<br>Delivery ${order.shipping === 0 ? 'FREE' : escapeHtml(rupees(order.shipping))}<br><strong>Total ${escapeHtml(rupees(order.total))}</strong></p>
      <p style="font-size:14px"><strong>Deliver to</strong><br>${escapeHtml(address)}<br>+91 ${escapeHtml(customer.phone)}</p>
      <p style="font-size:14px"><strong>Delivery time</strong><br>${escapeHtml(deliveryTime)}</p>
      <p><a href="${escapeHtml(orderUrl)}" style="display:inline-block;background:#0d8428;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">View order status</a></p>
      <p style="font-size:13px;color:#737373">Jummip</p>
    </div>`,
  });
}

export async function sendAdminOrderEmail(order: MailOrder): Promise<void> {
  if (!config.adminEmail || !order.customer || !order.deliveryAddress) return;
  const customer = order.customer;
  const deliveryAddress = order.deliveryAddress;
  const ordersUrl = `${config.storeUrl}/admin/orders`;
  const address = [
    deliveryAddress.line1,
    deliveryAddress.line2,
    `${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`,
  ]
    .filter(Boolean)
    .join(', ');
  const delivery = order.shipping === 0 ? 'FREE' : rupees(order.shipping);
  const itemLines = order.items.map(
    (item) =>
      `${item.productName} — ${item.size}, ${item.colour}, qty ${item.quantity} — ${rupees(item.priceAtPurchase * item.quantity)}`
  );
  const itemHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5">${escapeHtml(item.productName)}<br><span style="color:#525252;font-size:13px">${escapeHtml(item.size)} · ${escapeHtml(item.colour)} · Qty ${item.quantity}</span></td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right">${escapeHtml(rupees(item.priceAtPurchase * item.quantity))}</td></tr>`
    )
    .join('');
  await sendMail({
    to: config.adminEmail,
    replyTo: customer.email,
    subject: `New order ${order.orderNumber} · ${rupees(order.total)}`,
    text: [
      `New paid order ${order.orderNumber}.`,
      '',
      'Customer:',
      customer.name,
      customer.email,
      `+91 ${customer.phone}`,
      '',
      'Shipping:',
      address,
      `Delivery: ${delivery}`,
      '',
      'Products:',
      ...itemLines,
      '',
      `Subtotal: ${rupees(order.subtotal)}`,
      `Delivery: ${delivery}`,
      `Total: ${rupees(order.total)}`,
      '',
      `Open orders: ${ordersUrl}`,
    ].join('\n'),
    html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5;max-width:520px">
      <p>New paid order <strong>${escapeHtml(order.orderNumber)}</strong>.</p>
      <p style="font-size:14px"><strong>Customer</strong><br>${escapeHtml(customer.name)}<br>${escapeHtml(customer.email)}<br>+91 ${escapeHtml(customer.phone)}</p>
      <p style="font-size:14px"><strong>Shipping</strong><br>${escapeHtml(address)}<br>Delivery ${escapeHtml(delivery)}</p>
      <table style="width:100%;border-collapse:collapse">${itemHtml}</table>
      <p style="font-size:14px">Subtotal ${escapeHtml(rupees(order.subtotal))}<br>Delivery ${escapeHtml(delivery)}<br><strong>Total ${escapeHtml(rupees(order.total))}</strong></p>
      <p><a href="${escapeHtml(ordersUrl)}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">Open orders</a></p>
    </div>`,
  });
}

export async function sendOrderStatusEmail(order: MailOrder): Promise<void> {
  if (!order.customer?.email) return;
  const customer = order.customer;
  const label = deliveryLabel(order.shipmentStatus);
  const orderUrl = `${config.storeUrl}/order/${encodeURIComponent(order.orderNumber)}/status`;
  const extra =
    order.shipmentStatus === 'shipped'
      ? ' It is on the way. Delivery usually takes 4 to 7 business days after dispatch.'
      : order.shipmentStatus === 'delivered'
        ? ' It has been delivered.'
        : ' We are packing it. Packing usually takes 24 to 48 hours.';
  await sendMail({
    to: customer.email,
    subject: `Your Jummip order ${order.orderNumber} is ${label.toLowerCase()}`,
    text: `Hello ${customer.name},\n\nOrder ${order.orderNumber} is now ${label}.${extra}\n\nView this order: ${orderUrl}\n\nJummip`,
    html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5;max-width:520px">
      <p>Hello ${escapeHtml(customer.name)},</p>
      <p>Order <strong>${escapeHtml(order.orderNumber)}</strong> is now <strong>${escapeHtml(label)}</strong>.${escapeHtml(extra)}</p>
      <p><a href="${escapeHtml(orderUrl)}" style="display:inline-block;background:#0d8428;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">View order status</a></p>
      <p style="font-size:13px;color:#737373">Jummip</p>
    </div>`,
  });
}
