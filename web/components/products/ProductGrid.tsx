import type { ProductRecord } from '@/lib/catalog';
import { ProductCard } from '@/components/products/ProductCard';

export function ProductGrid({ products, view = 'grid' }: { products: ProductRecord[]; view?: 'grid' | 'list' }) {
  return (
    <div className={view === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-5'}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view={view} />
      ))}
    </div>
  );
}
