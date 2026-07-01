'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const CATEGORIES = [
  { value: '',             label: 'All'          },
  { value: 'FLOWER',       label: 'Flower'       },
  { value: 'EDIBLES',      label: 'Edibles'      },
  { value: 'VAPE_CARTS',   label: 'Vape Carts'   },
  { value: 'CONCENTRATES', label: 'Concentrates' },
  { value: 'PRE_ROLLS',    label: 'Pre-Rolls'    },
  { value: 'TINCTURES',    label: 'Tinctures'    },
  { value: 'TOPICALS',     label: 'Topicals'     },
  { value: 'BEVERAGES',    label: 'Beverages'    },
  { value: 'ACCESSORIES',  label: 'Accessories'  },
];

const STRAINS = [
  { value: '',       label: 'Any'    },
  { value: 'INDICA', label: 'Indica' },
  { value: 'SATIVA', label: 'Sativa' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'CBD',    label: 'CBD'    },
];

interface ShopFiltersProps {
  currentParams: Record<string, string | undefined>;
}

export function ShopFilters({ currentParams }: ShopFiltersProps) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value) sp.set(key, value); else sp.delete(key);
      sp.delete('page');
      router.push(`/shop?${sp.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <input
          type="text"
          defaultValue={currentParams.search ?? ''}
          placeholder="Product name…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') update('search', (e.target as HTMLInputElement).value);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => update('category', cat.value)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                (currentParams.category ?? '') === cat.value
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Strain */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Strain Type</label>
        <div className="space-y-1">
          {STRAINS.map((s) => (
            <button
              key={s.value}
              onClick={() => update('strain', s.value)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                (currentParams.strain ?? '') === s.value
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentParams.minPrice ?? ''}
            onBlur={(e) => update('minPrice', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentParams.maxPrice ?? ''}
            onBlur={(e) => update('maxPrice', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => router.push('/shop')}
        className="w-full text-sm text-gray-500 hover:text-brand-600 underline"
      >
        Clear all filters
      </button>
    </div>
  );
}
