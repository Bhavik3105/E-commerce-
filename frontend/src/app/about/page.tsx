import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata = {
  title: 'About Us | Jummip Garments',
  description: 'Learn about the story, values, craftsmanship, and dedication to quality behind Jummip Garments.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* ─── Hero Section ─── */}
      <section className="relative bg-neutral-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
            alt="Jummip Workshop"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-neutral-950/40" />
        </div>

        <div className="container relative z-10 max-w-3xl space-y-6 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30">
            Our Story & Craft
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Crafting Garments with <br />
            <span className="text-primary-400">Passion & Authenticity</span>.
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            At Jummip, we believe that true elegance starts with honest fabrics and thoughtful tailoring. From everyday comfort wear to statement festive pieces, our collections are designed to make you look and feel your best.
          </p>
        </div>
      </section>

      <div className="container space-y-16 max-w-5xl">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        {/* ─── Mission & Vision ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Redefining Garments for the Modern Wardrobe
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Founded with a mission to bring premium-grade garments directly to consumers without inflated markups, Jummip bridges the gap between luxury quality and accessible pricing.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every garment in our catalog begins with hand-selected yarn—predominantly breathable long-staple combed cotton, linen blends, and skin-friendly textiles. We meticulously test fabrics for colorfastness, shrinkage resistance, and softness before they ever touch the cutting table.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop"
              alt="Fabric quality and inspection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* ─── Core Pillars ─── */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">
              Our Core Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              The Values That Guide Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl">
                ✨
              </div>
              <h3 className="text-base font-bold text-neutral-900">Zero Compromise on Fabric</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We refuse synthetic-heavy shortcuts. Our focus is on all-day breathable natural fibers that feel soothing against Indian climates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl">
                ✂️
              </div>
              <h3 className="text-base font-bold text-neutral-900">Precision Tailoring</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                From collar stiffness to reinforced stitching and button durability, every stitch is calibrated for structured yet comfortable fits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl">
                📦
              </div>
              <h3 className="text-base font-bold text-neutral-900">Reliable Direct Delivery</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Each parcel is securely packed and handed over to trusted local courier partners, backed by full order tracking and a 7-day easy return policy.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Call to Action ─── */}
        <section className="bg-gradient-to-r from-primary-900 to-primary-800 text-white p-8 sm:p-12 rounded-2xl text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Experience the Jummip Difference
          </h2>
          <p className="text-sm text-primary-100 max-w-xl mx-auto">
            Explore our curated collections across Men&apos;s, Women&apos;s, Kids&apos; Wear and Accessories.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-sm"
            >
              Browse Catalog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 transition-colors border border-primary-500/40"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
