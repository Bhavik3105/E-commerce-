import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories, fetchProducts, homeProducts } from '@/lib/catalogue';
import { getDiscountPercent } from '@/lib/utils';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryCard } from '@/components/category/CategoryCard';
import { HeroSlider } from '@/components/home/HeroSlider';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramReels } from '@/components/home/InstagramReels';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  const saleProducts = products.filter((product) => product.salePrice && product.isActive).slice(0, 4);
  const maxSalePercent = saleProducts.reduce((max, product) => {
    if (!product.salePrice) return max;
    return Math.max(max, getDiscountPercent(product.price, product.salePrice));
  }, 0);

  return (
    <div className="pb-16">
      <HeroSlider />

      {/* ─── Value Propositions ─── */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 px-4 py-5 sm:px-8 lg:px-12">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Free Delivery</h4>
              <p className="text-[11px] sm:text-xs leading-tight text-neutral-500">Orders above ₹999</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">100% Cotton</h4>
              <p className="text-[11px] sm:text-xs leading-tight text-neutral-500">Breathable cotton</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Easy Returns</h4>
              <p className="text-[11px] sm:text-xs leading-tight text-neutral-500">7-day replacement</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Secure Payments</h4>
              <p className="text-[11px] sm:text-xs leading-tight text-neutral-500">Via Razorpay</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 pt-16">
      {/* ─── Shop By Category ─── */}
      <section className="container space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
            <p className="text-sm text-neutral-500 mt-1">{categories.map((category) => category.name).join(', ')}</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {categories.map((collection) => {
        const collectionProducts = homeProducts(products, collection.slug);
        if (collectionProducts.length === 0) return null;

        return (
          <section key={collection.slug} className="container space-y-6">
            <div className="flex justify-between items-end gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {collection.name} Collection
              </h2>
              <Link
                href={`/category/${collection.slug}`}
                className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors whitespace-nowrap"
              >
                View All &rarr;
              </Link>
            </div>
            <ProductGrid products={collectionProducts} />
          </section>
        );
      })}

      <InstagramReels />

      {saleProducts.length > 0 && (
      <section className="container">
        <div className="relative rounded-2xl overflow-hidden bg-primary-900 text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
              Limited Time Deals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Up to {maxSalePercent}% Off on Selected Styles
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
                    unoptimized
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
      )}

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

      <Testimonials />
      </div>
    </div>
  );
}
