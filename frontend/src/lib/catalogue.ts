import type { Category, Product } from '@/types';
import { apiBase } from '@/lib/api';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiBase()}/api/products`, { cache: 'no-store' });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: Product[] };
    return (body.data ?? []).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiBase()}/api/categories`, { cache: 'no-store' });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: Category[] };
    return body.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${apiBase()}/api/products/${slug}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: Product };
    return body.data ?? null;
  } catch {
    return null;
  }
}

export function productsForCategory(products: Product[], slug: string): Product[] {
  return products.filter((product) => product.categorySlug === slug && product.isActive);
}

export function homeProducts(products: Product[], slug: string): Product[] {
  const marked = products.filter(
    (product) => product.categorySlug === slug && product.isActive && product.showOnHome
  );
  const source = marked.length > 0 ? marked : productsForCategory(products, slug);
  return source.slice(0, 4);
}
