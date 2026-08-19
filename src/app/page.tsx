import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  FlaskConical,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VaultDoors } from "@/components/VaultDoors";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { db } from "@/lib/db";
import { categoryImage, usableProductImages } from "@/lib/product-images";
import { LIVE_CATALOG } from "@/lib/live-catalog";

export const metadata: Metadata = {
  title: "High Society MN | Fresh Flower, Good Energy",
  description:
    "Fresh cannabis, laid-back service, and metro delivery across Saint Paul and Minneapolis. Pull up the menu and find your next favorite.",
};

async function getFeaturedProducts() {
  const formatProducts = (products: typeof LIVE_CATALOG) => products
    .filter(product => product.category.slug !== "mystery" && !product.slug.startsWith("mystery-"))
    .slice(0, 8)
    .map(product => ({
    name: product.name,
    slug: product.slug,
    image: usableProductImages(product.images, product.category.name)[0],
    type: product.strain || product.category.name,
    thc: product.thcContent != null ? `${product.thcContent}% THC` : "Potency varies",
    price: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(product.price),
    effects: product.effects.slice(0, 3),
    flavor: product.flavors.slice(0, 3).join(" · ") || "See product details",
  }));
  try {
    const products = await db.product.findMany({
      where: {
        published: true,
        inStock: true,
        category: { slug: { not: "mystery" } },
        NOT: { slug: { startsWith: "mystery-" } },
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 8,
    });
    return products.length ? formatProducts(products) : formatProducts(LIVE_CATALOG);
  } catch { return formatProducts(LIVE_CATALOG); }
}

const categoryDescriptions: Record<string, string> = {
  flower: "Fresh buds, loud jars, and small-batch drops",
  "pre-rolls": "Twisted up and ready when the lobby loads",
  vapes: "Flavor-forward carts for low-key sessions",
  concentrates: "Hash, rosin, resin, diamonds, and heavy hitters",
  edibles: "Gummies, treats, and easygoing infused sips",
  specials: "Solid smoke without cooking the snack budget",
  mystery: "A little something for the ones who know",
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const categories = Array.from(
    LIVE_CATALOG.reduce((groups, product) => {
      if (product.category.slug === "mystery") return groups;
      const current = groups.get(product.category.slug);
      groups.set(product.category.slug, {
        name: product.category.name,
        slug: product.category.slug,
        image: current?.image ?? usableProductImages(product.images, product.category.name)[0] ?? categoryImage(product.category.name),
        count: (current?.count ?? 0) + 1,
      });
      return groups;
    }, new Map<string, { name: string; slug: string; image: string; count: number }>()).values()
  );
  return (
    <div className="min-h-screen bg-[#070706] text-[#f5f1e8]">
      <Header />
      <main>
        <VaultDoors products={featuredProducts.slice(0, 3)} />
        <ProductCarousel products={featuredProducts} />

        <section className="border-y border-[#8a5710]/20 bg-[#0b0b09]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
            {[
              [FlaskConical, "Lab verified", "Clean facts, no guesswork"],
              [Crown, "Handpicked", "Only the good stuff"],
              [Truck, "Metro delivery", "Tue · Thu · Sat"],
              [PackageCheck, "Low-key arrival", "Your business stays yours"],
            ].map(([Icon, title, detail]) => (
              <div key={String(title)} className="flex min-h-28 items-center gap-3 px-4 py-6 lg:px-7">
                <Icon className="h-5 w-5 shrink-0 text-[#e5a12b]" />
                <div>
                  <p className="text-sm font-semibold text-white">{String(title)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{String(detail)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Pick your lane</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-medium sm:text-5xl">What are we getting into tonight?</h2>
            </div>
            <Link href="/products" className="hidden items-center gap-2 text-sm text-[#e5a12b] hover:text-[#ffc263] sm:flex">
              View complete menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, slug, image, count }) => (
              <Link key={slug} href={`/products?category=${slug}`} className="group relative min-h-[390px] overflow-hidden bg-[#10100e]">
                <Image src={image} alt={`${name} product collection`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="mb-3 text-xs uppercase text-[#e5a12b]">{count} {count === 1 ? "selection" : "selections"}</p>
                  <h3 className="text-2xl font-medium">{name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{categoryDescriptions[slug] ?? "Explore the current collection"}</p>
                  <ArrowRight className="mt-6 h-5 w-5 text-[#e5a12b] transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow">The house standard</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-5xl">Fresh herb. Good people. No weird energy.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              "Real strain notes, not a wall of mystery numbers",
              "Flavor, terpenes, and expected effects laid out clean",
              "A straight-up menu with no runaround",
              "Discreet service that keeps your business your business",
            ].map((item) => (
              <div key={item} className="border-t border-[#8a5710]/30 pt-5">
                <Check className="mb-5 h-5 w-5 text-[#e5a12b]" />
                <p className="text-base leading-7 text-zinc-300">{item}</p>
              </div>
            ))}
            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-[#e5a12b] transition hover:text-[#ffc263] sm:col-span-2">
              Our story and house rules <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#11100d]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <div className="flex items-center gap-2 text-[#e5a12b]"><Sparkles className="h-4 w-4" /><span className="eyebrow">Fresh drop</span></div>
              <h2 className="mt-3 text-2xl font-medium sm:text-3xl">The menu is up. Come see what landed.</h2>
            </div>
            <Link href="/products" className="inline-flex h-12 items-center gap-3 bg-[#e5a12b] px-6 text-sm font-semibold text-black transition hover:bg-[#ffc263]">
              Check the stash <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
