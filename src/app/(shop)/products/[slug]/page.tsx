import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
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
    "/categories/flower.webp";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                unoptimized={imageUrl.startsWith("data:")}
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-200"
                  >
                    <Image src={img} alt={`${product.name} ${i + 2}`} fill unoptimized={img.startsWith("data:")} className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-indigo-500 text-sm uppercase tracking-wider mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-bold text-slate-950">{product.name}</h1>
              {product.brand && (
                <p className="text-slate-600 mt-1">by {product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-indigo-400">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-slate-500 line-through">
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
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-600">THC</p>
                  <p className="text-slate-950 font-bold">{product.thcContent}%</p>
                </div>
              )}
              {product.cbdContent !== null && product.cbdContent !== undefined && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-600">CBD</p>
                  <p className="text-slate-950 font-bold">{product.cbdContent}%</p>
                </div>
              )}
              {product.weight && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-600">Weight</p>
                  <p className="text-slate-950 font-bold">{product.weight}g</p>
                </div>
              )}
              {product.strain && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-600">Strain</p>
                  <p className="text-slate-950 font-bold capitalize">{product.strain}</p>
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="text-slate-950 font-semibold mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.effects.length > 0 && (
              <div>
                <h3 className="text-slate-950 font-semibold mb-2">Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((e) => (
                    <Badge key={e} variant="default">{e}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.flavors.length > 0 && (
              <div>
                <h3 className="text-slate-950 font-semibold mb-2">Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((f) => (
                    <Badge key={f} variant="outline">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton productId={product.id} disabled={!product.inStock} />

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <strong className="text-slate-950">Pickup or delivery</strong> — Schedule at checkout
              </p>
              <p className="text-xs text-slate-500">
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
