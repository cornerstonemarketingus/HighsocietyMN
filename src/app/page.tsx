export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Leaf, ShieldCheck, Star, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, inStock: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });
}

const CATEGORIES = [
  { name: 'Flower',       slug: 'FLOWER',       emoji: '🌿', desc: 'Top-shelf strains'       },
  { name: 'Edibles',      slug: 'EDIBLES',      emoji: '🍬', desc: 'Gummies, chocolates & more' },
  { name: 'Vape Carts',   slug: 'VAPE_CARTS',   emoji: '💨', desc: 'Discreet & convenient'   },
  { name: 'Concentrates', slug: 'CONCENTRATES', emoji: '💎', desc: 'Wax, shatter & rosin'     },
  { name: 'Pre-Rolls',    slug: 'PRE_ROLLS',    emoji: '🚬', desc: 'Ready to enjoy'            },
  { name: 'Beverages',    slug: 'BEVERAGES',    emoji: '🥤', desc: 'Cannabis-infused drinks'   },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Lab Tested',     desc: 'Every product tested for purity and potency'   },
  { icon: Star,        title: 'Premium Quality', desc: 'Curated selection of top-shelf cannabis'       },
  { icon: Leaf,        title: 'Local Grown',    desc: 'Sourced from Minnesota cultivators'             },
  { icon: Truck,       title: 'Store Pickup',   desc: 'Order online, pick up in-store same day'        },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/40 border border-brand-500/50 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            Premium Cannabis — Minneapolis, MN
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="text-gold-400">High Society MN</span>
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10">
            Minneapolis&apos;s finest cannabis dispensary. Lab-tested, locally sourced, and expertly curated for the discerning consumer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?featured=true"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-colors"
            >
              View Featured
            </Link>
          </div>
          <p className="mt-8 text-brand-300 text-sm">🔞 Must be 21+ to purchase</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl p-5 text-center hover:shadow-md hover:ring-2 hover:ring-brand-400 transition-all group"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="font-semibold text-sm text-gray-800 group-hover:text-brand-700">{cat.name}</span>
                <span className="text-xs text-gray-500">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Products</h2>
              <Link href="/shop?featured=true" className="text-brand-600 hover:text-brand-700 font-medium text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-300" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-brand-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="py-6 bg-yellow-50 border-t border-yellow-200">
        <p className="text-center text-xs text-yellow-800 max-w-3xl mx-auto px-4">
          ⚠️ <strong>Legal Notice:</strong> Cannabis products are intended for adults 21 years of age or older. Keep out of reach of children. Do not drive or operate machinery while using cannabis products. Cannabis has not been evaluated by the FDA.
        </p>
      </section>
    </div>
  );
}
