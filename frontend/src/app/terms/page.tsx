import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { siteConfig } from '@/lib/constants';

export const metadata = {
  title: 'Terms & Conditions | Jummip Garments',
  description: 'Terms of service and purchasing conditions for Jummip.',
};

export default function TermsPage() {
  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-400">Last updated: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6 leading-relaxed bg-white p-8 rounded-2xl border border-neutral-200">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from {siteConfig.name}, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Products & Sizing</h2>
          <p>
            We take every effort to accurately display product colours, fabric details, and sizing specifications. However, due to variations in monitor displays and lighting during photography, actual garment colours may vary slightly from online representations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Pricing & Payment</h2>
          <p>
            All prices on {siteConfig.name} are quoted in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to correct typographical pricing errors. Orders are confirmed only after payment verification by our payment partner Razorpay.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Order Cancellation</h2>
          <p>
            Orders can be cancelled before they are dispatched for delivery. Once handed over to our courier partner, cancellations cannot be accepted, but you may request a return or exchange according to our Return Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>
      </div>
    </div>
  );
}

