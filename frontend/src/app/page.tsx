import Link from 'next/link';
import Image from 'next/image';
import { products, getSaleProducts } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryCard } from '@/components/category/CategoryCard';

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const saleProducts = getSaleProducts().slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* ─── Hero Section ─── */}
      <section className="relative bg-neutral-900 text-white min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop"
            alt="Jummip Autumn Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent" />
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30">
              New Season Arrivals
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Wear Your <br />
              <span className="text-primary-400">Elegance</span> Every Day.
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              Carefully tailored garments handcrafted with breathable, premium fabrics. Built for timeless style and effortless comfort.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-900/20"
              >
                Shop All Collection
              </Link>
              <Link
                href="/category/mens-wear"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
              >
                Explore Men&apos;s
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Value Propositions ─── */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Free Delivery</h4>
              <p className="text-[11px] sm:text-xs text-neutral-500">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">100% Cotton</h4>
              <p className="text-[11px] sm:text-xs text-neutral-500">Breathable & durable</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Easy Returns</h4>
              <p className="text-[11px] sm:text-xs text-neutral-500">7-day replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Secure Payments</h4>
              <p className="text-[11px] sm:text-xs text-neutral-500">Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Shop By Category ─── */}
      <section className="container space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Explore our wide selection of hand-picked styles</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="container space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Featured Arrivals
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Curated picks for modern wardrobes</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            Explore More &rarr;
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* ─── Special Offer Banner ─── */}
      <section className="container">
        <div className="relative rounded-2xl overflow-hidden bg-primary-900 text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
              Limited Time Deals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Up to 30% Off on Selected Styles
            </h2>
            <p className="text-sm sm:text-base text-primary-200">
              Upgrade your seasonal wardrobe with premium fabrics at unbeatable prices. Shop the sale before stocks run out.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-md"
              >
                Shop Sale Items
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex-shrink-0 grid grid-cols-2 gap-4">
            {saleProducts.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="w-36 sm:w-44 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
                <h5 className="text-xs font-medium text-white truncate">{item.name}</h5>
                <span className="text-xs font-bold text-primary-300">
                  ₹{(item.salePrice || item.price) / 100}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── On Sale Collection ─── */}
      {saleProducts.length > 0 && (
        <section className="container space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Special Offers & Deals
              </h2>
              <p className="text-sm text-neutral-500 mt-1">Great quality, even better prices</p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          <ProductGrid products={saleProducts} />
        </section>
      )}
    </div>
  );
}
