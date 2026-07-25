'use client';

import { useMemo, useState } from 'react';
import type { ProductRecord } from '@/lib/catalog';
import { ProductFilters, type ProductFilterState } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';

const initialState: ProductFilterState = {
  category: 'All',
  strainType: 'All',
  search: '',
  minPrice: 0,
  maxPrice: 100,
  minThc: 0,
  sort: 'popular',
  view: 'grid',
};

export function ProductsExplorer({ products }: { products: ProductRecord[] }) {
  const [state, setState] = useState<ProductFilterState>(initialState);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (state.category !== 'All' && product.category !== state.category) return false;
      if (state.strainType !== 'All' && product.strainType !== state.strainType) return false;
      if (product.price > state.maxPrice || product.price < state.minPrice) return false;
      if ((product.thc ?? 0) < state.minThc) return false;
      if (state.search) {
        const haystack = `${product.name} ${product.description} ${product.category} ${product.strain ?? ''}`.toLowerCase();
        if (!haystack.includes(state.search.toLowerCase())) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      switch (state.sort) {
        case 'newest':
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'thc':
          return (b.thc ?? 0) - (a.thc ?? 0);
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [products, state]);

  return (
    <section className="page-shell py-12">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-300">Online menu</p>
        <h1 className="section-heading">Shop the full High Society MN catalog</h1>
        <p className="max-w-3xl text-lg text-slate-300 light:text-slate-600">
          Browse over one hundred curated products with robust filtering, potency guidance, and quick add-to-cart actions.
        </p>
      </div>
      <ProductFilters state={state} onChange={setState} />
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-400 light:text-slate-600">Showing {filteredProducts.length} products</p>
        </div>
        <ProductGrid products={filteredProducts} view={state.view} />
      </div>
    </section>
  );
}
