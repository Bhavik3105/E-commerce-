import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  title,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  return (
    <section>
      {title && (
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-800 mb-6">
          {title}
        </h2>
      )}

      {products.length === 0 ? (
        <p className="text-center text-stone-500 py-16">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
