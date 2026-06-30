'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { addToCart } from '@/lib/cart-client';
import { firstImage, formatUsd } from '@/lib/format';
import { useToast } from '@/components/ui/ToastProvider';

type ProductResponse = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  thcPercent: number;
  cbdPercent: number;
  stock: number;
  images: string[];
  terpeneProfile: string[];
  effects: string[];
  reviews: Array<{ id: string; author: string; rating: number; comment: string }>;
  related: Array<{ id: string; name: string; images: string[]; priceCents: number }>;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setError('');
      })
      .catch(() => setError('Unable to load product details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const canAdd = useMemo(() => product && product.stock > 0, [product]);
  const selectedSrc = useMemo(
    () => (product ? product.images[selectedImage] ?? firstImage(product.images) : ''),
    [product, selectedImage],
  );

  const handleAdd = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      showToast('Added to cart');
    } catch {
      showToast('Could not add to cart');
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading product...</p>;
  if (error || !product) return <p className="text-sm text-red-600">{error || 'Product not found'}</p>;

  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-xl border border-emerald-900/10 bg-white p-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-emerald-100">
            <Image
              src={selectedSrc}
              alt={product.name}
              fill
              className="object-cover transition duration-300 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(product.images.length ? product.images : [firstImage(product.images)]).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-md border ${selectedImage === index ? 'border-emerald-700' : 'border-slate-200'}`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="33vw" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-emerald-900">{product.name}</h1>
          <p className="text-xl font-semibold text-emerald-800">{formatUsd(product.priceCents)}</p>
          <p className="text-slate-700">{product.description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">THC {product.thcPercent}%</span>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">CBD {product.cbdPercent}%</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold text-slate-700">Terpene Profile</h2>
            <div className="flex flex-wrap gap-2">
              {product.terpeneProfile.map((terpene) => (
                <span key={terpene} className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                  {terpene}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold text-slate-700">Effects</h2>
            <div className="flex flex-wrap gap-2">
              {product.effects.map((effect) => (
                <span key={effect} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                  {effect}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold" htmlFor="quantity">
              Qty
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.stock > 0 ? product.stock : 1}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
              className="w-20 rounded-md border border-slate-300 px-2 py-1"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:bg-slate-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-900/10 bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold text-emerald-900">Customer Reviews</h2>
        <div className="space-y-3">
          {product.reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium text-slate-900">{review.author}</p>
              <p className="text-sm text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <p className="text-sm text-slate-700">{review.comment}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-900/10 bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold text-emerald-900">Related Products</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {product.related.map((related) => (
            <Link
              key={related.id}
              href={`/products/${related.id}`}
              className="min-w-52 rounded-lg border border-slate-200 p-2"
            >
              <div className="relative mb-2 aspect-square overflow-hidden rounded-md">
                <Image src={firstImage(related.images)} alt={related.name} fill className="object-cover" sizes="208px" />
              </div>
              <p className="line-clamp-1 text-sm font-semibold text-slate-900">{related.name}</p>
              <p className="text-sm text-emerald-700">{formatUsd(related.priceCents)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
