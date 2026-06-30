import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
}

const STRAIN_COLORS: Record<string, string> = {
  INDICA:  'bg-purple-100 text-purple-800',
  SATIVA:  'bg-orange-100 text-orange-800',
  HYBRID:  'bg-blue-100   text-blue-800',
  CBD:     'bg-green-100  text-green-800',
};

export function ProductCard({ product }: ProductCardProps) {
  const image  = product.images[0];
  const strain = product.strain ?? null;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🌿</div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/shop/${product.slug}`} className="font-semibold text-sm text-gray-900 hover:text-brand-700 leading-tight">
            {product.name}
          </Link>
          {strain && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0 ${STRAIN_COLORS[strain] ?? 'bg-gray-100 text-gray-700'}`}>
              {strain.charAt(0) + strain.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-2 capitalize">
          {product.category.replace(/_/g, ' ').toLowerCase()}
        </p>

        {(product.thcPercentage || product.cbdPercentage) && (
          <div className="flex gap-3 text-xs text-gray-600 mb-3">
            {product.thcPercentage && <span>THC: <strong>{product.thcPercentage}%</strong></span>}
            {product.cbdPercentage && <span>CBD: <strong>{product.cbdPercentage}%</strong></span>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-brand-700 text-lg">${product.price.toFixed(2)}</span>
          <button
            disabled={!product.inStock}
            className="flex items-center gap-1.5 text-xs font-medium bg-brand-600 hover:bg-brand-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
