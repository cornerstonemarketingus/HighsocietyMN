export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Star } from 'lucide-react';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

const STRAIN_COLORS: Record<string, string> = {
  INDICA:  'bg-purple-100 text-purple-800',
  SATIVA:  'bg-orange-100 text-orange-800',
  HYBRID:  'bg-blue-100   text-blue-800',
  CBD:     'bg-green-100  text-green-800',
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { createdAt: 'desc' }, take: 10 } },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/shop" className="hover:text-brand-600">Shop</a>
        <span className="mx-2">/</span>
        <a href={`/shop?category=${product.category}`} className="hover:text-brand-600 capitalize">
          {product.category.replace(/_/g, ' ').toLowerCase()}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image src={src} alt={`${product.name} ${i + 2}`} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
              {product.category.replace(/_/g, ' ').toLowerCase()}
            </span>
            {product.strain && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STRAIN_COLORS[product.strain] ?? 'bg-gray-100 text-gray-700'}`}>
                {product.strain.charAt(0) + product.strain.slice(1).toLowerCase()}
              </span>
            )}
            {product.weight && (
              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {product.weight}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>

          {avgRating !== null && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({product.reviews.length})</span>
            </div>
          )}

          <p className="text-3xl font-bold text-brand-700 mb-6">${product.price.toFixed(2)}</p>

          {/* Potency */}
          {(product.thcPercentage || product.cbdPercentage) && (
            <div className="flex gap-4 mb-6">
              {product.thcPercentage && (
                <div className="bg-brand-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-xl font-bold text-brand-700">{product.thcPercentage}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">THC</div>
                </div>
              )}
              {product.cbdPercentage && (
                <div className="bg-blue-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-xl font-bold text-blue-700">{product.cbdPercentage}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">CBD</div>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {product.effects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Effects</h3>
              <div className="flex flex-wrap gap-2">
                {product.effects.map((e) => (
                  <span key={e} className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2 py-1 rounded-full capitalize">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.terpenes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Terpenes</h3>
              <div className="flex flex-wrap gap-2">
                {product.terpenes.map((t) => (
                  <span key={t} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full capitalize">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {product.inStock ? (
              <AddToCartButton productId={product.id} productName={product.name} />
            ) : (
              <button disabled className="w-full py-3 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed">
                Out of Stock
              </button>
            )}
          </div>

          {/* Compliance */}
          <p className="mt-6 text-xs text-gray-400 border-t pt-4">
            ⚠️ For adults 21+ only. This product has not been evaluated by the FDA. Keep out of reach of children and pets. Do not drive after use.
          </p>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                  ))}
                  {review.verified && (
                    <span className="ml-2 text-xs text-green-600 font-medium">✓ Verified</span>
                  )}
                </div>
                {review.title && <p className="font-semibold text-sm mb-1">{review.title}</p>}
                <p className="text-sm text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
