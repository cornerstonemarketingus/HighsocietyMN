import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const imageUrl =
    product.images[0] ??
    "https://images.unsplash.com/photo-1668001201519-1e5bff88bf01?w=800&q=80";

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10"
                  >
                    <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-400 mt-1">by {product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-amber-400">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.inStock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            {/* Cannabis info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.thcContent !== null && product.thcContent !== undefined && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">THC</p>
                  <p className="text-white font-bold">{product.thcContent}%</p>
                </div>
              )}
              {product.cbdContent !== null && product.cbdContent !== undefined && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">CBD</p>
                  <p className="text-white font-bold">{product.cbdContent}%</p>
                </div>
              )}
              {product.weight && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">Weight</p>
                  <p className="text-white font-bold">{product.weight}g</p>
                </div>
              )}
              {product.strain && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">Strain</p>
                  <p className="text-white font-bold capitalize">{product.strain}</p>
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.effects.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((e) => (
                    <Badge key={e} variant="default">{e}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.flavors.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((f) => (
                    <Badge key={f} variant="outline">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full gap-2"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <div className="border border-white/10 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                🏪 <strong className="text-white">Store Pickup Only</strong> — Available same day
              </p>
              <p className="text-xs text-gray-500">
                ⚠️ Must be 21+ with valid ID at pickup. Cannabis for adult use only.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
