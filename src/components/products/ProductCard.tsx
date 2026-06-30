'use client';

import Image from 'next/image';
import Link from 'next/link';

import { addToCart } from '@/lib/cart-client';
import { firstImage, formatUsd } from '@/lib/format';
import { useToast } from '@/components/ui/ToastProvider';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    thcPercent: number;
    cbdPercent: number;
    images: string[];
    stock: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { showToast } = useToast();

  const handleAdd = async () => {
    try {
      await addToCart(product.id, 1);
      showToast('Added to cart');
    } catch {
      showToast('Could not add to cart');
    }
  };

  return (
    <article className="overflow-hidden rounded-xl border border-emerald-950/10 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-emerald-100">
          <Image
            src={firstImage(product.images)}
            alt={product.name}
            fill
            className="object-cover transition duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 23vw"
          />
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold text-emerald-950">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">THC {product.thcPercent}%</span>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">CBD {product.cbdPercent}%</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="font-semibold text-emerald-900">{formatUsd(product.priceCents)}</p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock < 1}
            className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.stock < 1 ? 'Out of stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
