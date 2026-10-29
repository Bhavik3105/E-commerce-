import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata = {
  title: 'Shipping Policy | Jummip Garments',
  description: 'Shipping timelines, courier handling, and delivery information for Jummip.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Shipping Policy' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-neutral-400">Last updated: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6 leading-relaxed bg-white p-8 rounded-2xl border border-neutral-200">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Order Processing Time</h2>
          <p>
            All garments undergo quality inspection and packaging before dispatch. Standard orders are processed and prepared for shipping within <strong>24 to 48 hours</strong> (excluding Sundays and national holidays).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Delivery Partners & Timeline</h2>
          <p>
            We partner with reliable local and domestic courier services to ensure your parcel reaches you safely.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Metro Cities:</strong> 2 to 4 business days</li>
            <li><strong>Rest of India:</strong> 4 to 7 business days</li>
            <li><strong>Remote or North-East regions:</strong> 6 to 9 business days</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Orders above ₹999:</strong> FREE Delivery across India</li>
            <li><strong>Orders under ₹999:</strong> Flat ₹99 delivery charge</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Delivery Address & Phone Number</h2>
          <p>
            Please provide complete address details with a landmark and an active 10-digit mobile number so the courier delivery agent can coordinate handover smoothly.
          </p>
        </section>
      </div>
    </div>
  );
}
