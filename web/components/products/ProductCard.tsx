'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ProductRecord } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

export function ProductCard({ product, view = 'grid' }: { product: ProductRecord; view?: 'grid' | 'list' }) {
  const addItem = useCartStore((state) => state.addItem);
  const layout =
    view === 'grid'
      ? 'flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-brand-400/50'
      : 'grid gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 transition hover:border-brand-400/50 md:grid-cols-[180px_1fr]';

  return (
    <article className={layout}>
      <Link href={`/products/${product.slug}`} className={view === 'grid' ? 'block' : 'relative'}>
        <div className={view === 'grid' ? 'relative aspect-square overflow-hidden' : 'relative aspect-square overflow-hidden rounded-[22px]'}>
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <div className={view === 'grid' ? 'flex flex-1 flex-col p-5' : 'flex flex-col justify-between'}>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{product.category}</Badge>
            {product.strainType ? <Badge className="bg-white/10 text-white">{product.strainType}</Badge> : null}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xl font-semibold text-white light:text-slate-900">{product.name}</h3>
          </Link>
          <p className="mt-2 text-sm text-slate-400 light:text-slate-600">{product.description}</p>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-brand-300">{formatPrice(product.price)}</p>
              {product.comparePrice ? <p className="text-sm text-slate-500 line-through">{formatPrice(product.comparePrice)}</p> : null}
            </div>
            <div className="text-right text-sm text-slate-300 light:text-slate-700">
              <p>{product.thc ? `${product.thc}% THC` : 'Lab tested'}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-amber-300">
                <Star className="h-4 w-4 fill-current" /> {product.rating} ({product.reviewCount})
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={() => addItem(product)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
