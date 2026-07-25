'use client';

import { Filter, LayoutGrid, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const categories = ['All', 'Flower', 'Pre-Rolls', 'Vapes', 'Concentrates', 'Edibles'];
const strainTypes = ['All', 'Indica', 'Hybrid', 'Sativa'];

export type ProductFilterState = {
  category: string;
  strainType: string;
  search: string;
  minPrice: number;
  maxPrice: number;
  minThc: number;
  sort: string;
  view: 'grid' | 'list';
};

type ProductFiltersProps = {
  state: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
};

export function ProductFilters({ state, onChange }: ProductFiltersProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="glass-card h-fit rounded-[28px] p-6">
        <div className="mb-6 flex items-center gap-2 text-white light:text-slate-900">
          <Filter className="h-5 w-5 text-brand-300" />
          <h2 className="text-lg font-semibold">Filter the menu</h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Search</label>
            <input
              value={state.search}
              onChange={(event) => onChange({ ...state, search: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-400"
              placeholder="Search flower, carts, gummies..."
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Category</label>
            <select
              value={state.category}
              onChange={(event) => onChange({ ...state, category: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-400"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Strain type</label>
            <select
              value={state.strainType}
              onChange={(event) => onChange({ ...state, strainType: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-400"
            >
              {strainTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Max price: ${state.maxPrice}</label>
            <input
              type="range"
              min={10}
              max={100}
              value={state.maxPrice}
              onChange={(event) => onChange({ ...state, maxPrice: Number(event.target.value) })}
              className="w-full accent-brand-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Minimum THC: {state.minThc}%</label>
            <input
              type="range"
              min={0}
              max={90}
              value={state.minThc}
              onChange={(event) => onChange({ ...state, minThc: Number(event.target.value) })}
              className="w-full accent-brand-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200 light:text-slate-800">Sort by</label>
            <select
              value={state.sort}
              onChange={(event) => onChange({ ...state, sort: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-400"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="thc">THC %</option>
            </select>
          </div>
        </div>
      </aside>
      <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Curated menu</p>
          <p className="text-sm text-slate-400 light:text-slate-600">Filter premium Minnesota flower, vapes, edibles, concentrates, and more.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={state.view === 'grid' ? 'primary' : 'ghost'} size="sm" onClick={() => onChange({ ...state, view: 'grid' })}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={state.view === 'list' ? 'primary' : 'ghost'} size="sm" onClick={() => onChange({ ...state, view: 'list' })}>
            <Rows3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
