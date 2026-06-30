'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProductCard } from '@/components/products/ProductCard';
import { CATEGORY_OPTIONS, MAX_PRICE_FILTER } from '@/lib/constants';

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  thcPercent: number;
  cbdPercent: number;
  images: string[];
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_FILTER);
  const [sort, setSort] = useState('newest');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '12');
    params.set('sort', sort);
    params.set('minPrice', String(minPrice));
    params.set('maxPrice', String(maxPrice));
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    return params.toString();
  }, [page, sort, minPrice, maxPrice, search, category]);

  useEffect(() => {
    let active = true;

    fetch(`/api/products?${query}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages || 1);
        setError('');
      })
      .catch(() => {
        if (active) setError('Unable to load products right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-emerald-900">Products</h1>
        <div className="grid gap-3 rounded-xl border border-emerald-900/10 bg-white p-4 md:grid-cols-4">
          <input
            value={search}
            onChange={(event) => {
              setLoading(true);
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or description"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />

          <select
            value={category}
            onChange={(event) => {
              setLoading(true);
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => {
              setLoading(true);
              setSort(event.target.value);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Min price (${minPrice})</label>
            <input
              type="range"
              min={0}
              max={MAX_PRICE_FILTER}
              value={minPrice}
              onChange={(event) => {
                setLoading(true);
                const val = Number(event.target.value);
                setMinPrice(Math.min(val, maxPrice));
                setPage(1);
              }}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Max price (${maxPrice})</label>
            <input
              type="range"
              min={0}
              max={MAX_PRICE_FILTER}
              value={maxPrice}
              onChange={(event) => {
                setLoading(true);
                const val = Number(event.target.value);
                setMaxPrice(Math.max(val, minPrice));
                setPage(1);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-600">Loading products...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && <p className="text-sm text-slate-600">No products match your filters.</p>}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setPage((prev) => Math.max(1, prev - 1));
              }}
              disabled={page === 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setPage((prev) => Math.min(totalPages, prev + 1));
              }}
              disabled={page >= totalPages}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
