import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { siteConfig } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy | Jummip Garments',
  description: 'Understand how Jummip collects, uses, and protects your personal and order data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400">Last updated: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6 leading-relaxed bg-white p-8 rounded-2xl border border-neutral-200">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Information We Collect</h2>
          <p>
            When you visit or make a purchase from {siteConfig.name}, we collect personal information you provide to us, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details: Name, email address, phone number</li>
            <li>Delivery address: House/flat number, street, city, state, PIN code</li>
            <li>Order information: Items purchased, quantities, sizes, colours, and amounts</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Payment Security</h2>
          <p>
            We process all online payments through Razorpay, a PCI-DSS certified payment gateway. <strong>We do not store or process your credit/debit card numbers, CVVs, or UPI PINs on our servers.</strong> All payment data is handled directly and securely through Razorpay’s encrypted gateway.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. How We Use Your Information</h2>
          <p>We use your information solely to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, fulfill, and deliver your garment orders</li>
            <li>Send email confirmations and delivery notifications</li>
            <li>Coordinate with our local courier partners for physical delivery</li>
            <li>Provide customer support and resolve order queries</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Third-Party Sharing</h2>
          <p>
            We only share your information with trusted third parties strictly necessary to operate our service:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Razorpay:</strong> To process secure payments</li>
            <li><strong>Courier Services:</strong> To deliver physical packages to your address</li>
            <li><strong>Transactional Email Providers:</strong> To send order receipts</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to advertisers.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">5. Contact Us</h2>
          <p>
            If you have questions regarding this privacy policy or your data, please contact us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 underline">
              {siteConfig.contact.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
