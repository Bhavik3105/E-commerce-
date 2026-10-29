import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { siteConfig } from '@/lib/constants';

export const metadata = {
  title: 'Returns & Refund Policy | Jummip Garments',
  description: 'Easy 7-day return and exchange policy for garment orders at Jummip.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Returns & Refunds' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Returns & Refund Policy
        </h1>
        <p className="text-xs text-neutral-400">Last updated: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6 leading-relaxed bg-white p-8 rounded-2xl border border-neutral-200">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. 7-Day Easy Return / Exchange Window</h2>
          <p>
            We want you to love your garments. If you are not satisfied with the fit, size, or quality, you may request an exchange or return within <strong>7 days</strong> of delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Conditions for Return</h2>
          <p>To be eligible for a return or replacement:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Garments must be unworn, unwashed, and undamaged</li>
            <li>Original tags and brand packaging must be intact</li>
            <li>Proof of purchase (Order Number and email) must be provided</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Non-Returnable Items</h2>
          <p>
            For hygienic reasons, certain intimate apparel, custom altered garments, or sale items marked &ldquo;Final Sale&rdquo; cannot be returned or refunded unless defective upon arrival.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Refund Process</h2>
          <p>
            Once the returned parcel is received and inspected at our facility, refunds are initiated within <strong>2 to 4 business days</strong> directly to the original payment method through Razorpay. Bank processing may take an additional 3 to 5 working days to reflect on your statement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. How to Initiate a Return</h2>
          <p>
            To initiate a return or exchange, simply email us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 underline">
              {siteConfig.contact.email}
            </a>{' '}
            with your <strong>Order Number</strong> and photos showing the issue or required size exchange.
          </p>
        </section>
      </div>
    </div>
  );
}
