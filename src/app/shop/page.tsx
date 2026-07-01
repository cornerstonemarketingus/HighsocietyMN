export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { ShopFilters } from '@/components/products/ShopFilters';
import type { Prisma } from '@prisma/client';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    strain?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 24;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.ProductWhereInput = { inStock: true };

  if (params.category)        where.category = params.category as Prisma.ProductWhereInput['category'];
  if (params.strain)          where.strain   = params.strain   as Prisma.ProductWhereInput['strain'];
  if (params.featured === 'true') where.featured = true;
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Prisma.FloatFilter).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.price as Prisma.FloatFilter).lte = parseFloat(params.maxPrice);
  }
  if (params.search) {
    where.OR = [
      { name:        { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: PAGE_SIZE, orderBy: { featured: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
        {params.category
          ? params.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : params.search
          ? `Search: "${params.search}"`
          : 'All Products'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <ShopFilters currentParams={params} />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{total} product{total !== 1 ? 's' : ''} found</p>

          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                const sp = new URLSearchParams(
                  Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined)
                  ) as Record<string, string>
                );
                sp.set('page', String(p));
                return (
                  <a
                    key={p}
                    href={`/shop?${sp.toString()}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
