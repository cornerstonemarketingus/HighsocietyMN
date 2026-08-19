import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { categoryImage } from "@/lib/product-images";
import { usableProductImages } from "@/lib/product-images";
import { ArrowLeft, Droplets, Gem, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "@/components/products/ProductGallery";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    return product;
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

  const fallbackImage = categoryImage(product.category.name);
  const images = usableProductImages(product.images, product.category.name);
  const cleanDescription = product.description
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc263] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] lg:gap-14">
          {/* Image */}
          <ProductGallery images={images} fallback={fallbackImage} name={product.name} />

          {/* Details */}
          <div className="relative space-y-7 border border-[#e5a12b]/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.105),rgba(255,215,0,0.035)_42%,rgba(255,255,255,0.025))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.16),0_0_55px_rgba(255,215,0,0.07)] backdrop-blur-2xl sm:p-9 lg:sticky lg:top-28">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc263] to-transparent" />
            <div>
              <p className="text-[#e5a12b] text-sm uppercase tracking-wider mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-400 mt-1">by {product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#ffc263]">
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

            {cleanDescription && (
              <div className="border-t border-white/10 pt-6">
                <div className="mb-3 flex items-center gap-2 text-[#e5a12b]"><Gem className="h-4 w-4" /><h2 className="text-sm font-semibold uppercase">About this selection</h2></div>
                <p className="text-[15px] leading-7 text-zinc-300">
                  {cleanDescription}
                </p>
              </div>
            )}

            {product.effects.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Sparkles className="h-4 w-4 text-[#e5a12b]" /> Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((e) => (
                    <Badge key={e} variant="default">{e}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.flavors.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Droplets className="h-4 w-4 text-[#e5a12b]" /> Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((f) => (
                    <Badge key={f} variant="outline">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton productId={product.id} inStock={product.inStock} className="h-12 w-full gap-2 text-base" />

            <div className="border border-white/10 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <strong className="text-white">Delivery service</strong> — Tuesday, Thursday, and Saturday
              </p>
              <p className="text-xs text-gray-500">
                Must be 21+ with valid ID at delivery. Cannabis for adult use only.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
