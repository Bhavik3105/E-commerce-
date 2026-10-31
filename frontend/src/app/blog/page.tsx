import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { NewsletterForm } from '@/components/blog/NewsletterForm';

export const metadata = {
  title: 'Blog & Style Journal | Jummip Garments',
  description: 'Style guides, garment care tips, fabric insights, and wardrobe essentials from Jummip.',
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'How to Care for 100% Combed Cotton Garments for Long-Lasting Softness',
    slug: 'how-to-care-for-cotton-garments',
    excerpt:
      'Learn the best washing temperatures, drying habits, and ironing secrets to keep your cotton shirts, kurtis, and t-shirts looking brand new year after year.',
    category: 'Garment Care',
    readTime: '4 min read',
    date: 'October 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=600&h=400&fit=crop',
  },
  {
    id: 'post-2',
    title: 'The Ultimate Guide to Men’s Smart Casual: Balancing Comfort and Style',
    slug: 'mens-smart-casual-guide',
    excerpt:
      'From classic cotton button-downs paired with stretch chinos to breathable crewnecks, master the art of effortless smart-casual dressing for work and weekend outings.',
    category: 'Style Guide',
    readTime: '5 min read',
    date: 'October 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop',
  },
  {
    id: 'post-3',
    title: 'Ethnic Elegance: How to Style Embroidered Kurtis for Festive Gatherings',
    slug: 'styling-embroidered-kurtis',
    excerpt:
      'Discover versatile ways to pair floral embroidered kurtis with palazzos, statement dupattas, and classic footwear for weddings, festivities, or family dinners.',
    category: 'Women’s Fashion',
    readTime: '6 min read',
    date: 'October 12, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=400&fit=crop',
  },
  {
    id: 'post-4',
    title: 'Choosing Kids’ Clothes That Combine Fun, Safety, and Maximum Durability',
    slug: 'choosing-kids-clothing-durability',
    excerpt:
      'Active kids need gentle, chemical-free cotton fabrics that endure playground adventures and frequent laundering without losing their vibrant colors.',
    category: 'Kids & Family',
    readTime: '4 min read',
    date: 'October 05, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=400&fit=crop',
  },
];

export default function BlogPage() {
  const [featured, ...recent] = blogPosts;

  return (
    <div className="container py-8 space-y-12 max-w-5xl">
      <Breadcrumb items={[{ label: 'Blog & Journal' }]} />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-600">
          Jummip Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Stories, Styling & Garment Care
        </h1>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Helpful styling guides, fabric care recommendations, and the latest news from our tailoring studio.
        </p>
      </div>

      {/* ─── Featured Post ─── */}
      {featured && (
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="relative md:col-span-7 aspect-[16/10] md:aspect-auto md:h-full min-h-[260px] bg-neutral-100">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-8 md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                {featured.category}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500">{featured.readTime}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 hover:text-primary-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
              {featured.excerpt}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
              <span>{featured.date}</span>
              <span className="font-semibold text-primary-600">Read Article &rarr;</span>
            </div>
          </div>
        </section>
      )}

      {/* ─── Recent Articles Grid ─── */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-neutral-900">Recent Articles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recent.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-medium">
                    <span className="text-primary-700 font-semibold">{post.category}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-400">{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{post.date}</span>
                  <span className="font-medium text-primary-600">Read &rarr;</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Newsletter / Tips Signup ─── */}
      <section className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
          Stay in the Loop
        </span>
        <h3 className="text-xl font-bold text-neutral-900">
          Subscribe to Jummip Style Journal
        </h3>
        <p className="text-xs text-neutral-500">
          Get seasonal lookbooks, fabric care guides, and exclusive discount codes directly in your inbox.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
