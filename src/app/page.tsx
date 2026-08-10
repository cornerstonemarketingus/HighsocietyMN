import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { DropTimer } from "@/components/DropTimer";
import { VaultDrop } from "@/components/VaultDrop";
import { ProductCard } from "@/components/products/ProductCard";
import { db } from "@/lib/db";
import { attachSoldCounts } from "@/lib/products";
import {
  ArrowRight,
  MapPin,
  Star,
  Shield,
  Truck,
  Package,
  Zap,
  MessageSquare,
  BookOpen,
  Crown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "High Society MN | Premium Cannabis Delivery — Saint Paul & Minneapolis",
  description:
    "Minnesota's premier cannabis delivery boutique. Premium flower, edibles, vapes & concentrates delivered to Saint Paul & Minneapolis metro. 21+ only. Delivery Tue, Thu, Sat.",
  keywords: [
    "cannabis delivery Minnesota",
    "weed delivery Saint Paul",
    "cannabis delivery Minneapolis",
    "THC delivery MN",
    "premium cannabis boutique Minnesota",
    "high society MN",
  ],
  openGraph: {
    title: "High Society MN | Premium Cannabis Delivery",
    description: "Luxury cannabis delivery service in Saint Paul & Minneapolis metro.",
    type: "website",
  },
};

const categories = [
  {
    name: "Flower",
    slug: "flower",
    image: "/categories/flower.webp",
    imageAlt: "Pink Runtz flower from the High Society MN catalog",
    description: "Aroma-forward cultivars, selected for freshness, structure, and character.",
  },
  {
    name: "Edibles",
    slug: "edibles",
    image: "/categories/edibles.webp",
    imageAlt: "Mitten Extracts gummies from the High Society MN catalog",
    description: "Measured formats with clear details and an easy, consistent experience.",
  },
  {
    name: "Vapes",
    slug: "vapes",
    image: "/categories/vapes.webp",
    imageAlt: "Sweetcarts vape from the High Society MN catalog",
    description: "Portable formats chosen for flavor, hardware quality, and simplicity.",
  },
  {
    name: "Concentrates",
    slug: "concentrates",
    image: "/categories/concentrates.webp",
    imageAlt: "Premium hash bar from the High Society MN catalog",
    description: "High-potency extracts for experienced customers seeking depth and clarity.",
  },
  {
    name: "Beverages",
    slug: "beverages",
    image: "/categories/beverages.webp",
    imageAlt: "Oliphant Brewing THC beverage from the High Society MN catalog",
    description: "Bright, social formats with straightforward serving information.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/categories/accessories.webp",
    imageAlt: "Infuzed by Society product from the High Society MN catalog",
    description: "Useful essentials selected to keep every part of the ritual considered.",
  },
] as const;

const trustItems = [
  { icon: Shield, title: "Product standards", detail: "Clear, verified details" },
  { icon: Crown, title: "Focused menu", detail: "Selected, never crowded" },
  { icon: Truck, title: "Scheduled service", detail: "Tue · Thu · Sat" },
  { icon: Package, title: "Discreet handoff", detail: "Private by design" },
] as const;

const communityCards = [
  {
    href: "/blog",
    icon: BookOpen,
    eyebrow: "The Journal",
    title: "Know what you’re choosing.",
    description:
      "Clear guides, product context, and responsible-use education—written for real decisions.",
    cta: "Read the journal",
  },
  {
    href: "/forum",
    icon: MessageSquare,
    eyebrow: "Member Lounge",
    title: "Pull up a seat.",
    description:
      "Trade recommendations, talk new drops, and connect with the local community.",
    cta: "Enter the lounge",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "High Society MN",
  description:
    "Premium cannabis delivery boutique serving Saint Paul and Minneapolis with curated flower, edibles, vapes, concentrates, beverages, and accessories.",
  areaServed: ["Saint Paul, MN", "Minneapolis, MN"],
  availableService: {
    "@type": "Service",
    name: "Cannabis Delivery",
    areaServed: "Saint Paul & Minneapolis Metro",
    hoursAvailable: "Tue, Thu, Sat 10:00",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Premium cannabis collection",
    itemListElement: categories.map((category) => ({
      "@type": "OfferCatalog",
      name: category.name,
    })),
  },
};

async function getTrendingProducts() {
  try {
    const products = await db.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { featured: "desc" },
      take: 10,
    });
    return await attachSoldCounts(products);
  } catch {
    return [];
  }
}

const browseTabs = [
  { label: "Flower", href: "/products?category=flower" },
  { label: "Edibles", href: "/products?category=edibles" },
  { label: "Vapes", href: "/products?category=vapes" },
  { label: "Concentrates", href: "/products?category=concentrates" },
  { label: "Beverages", href: "/products?category=beverages" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Drops", href: "/drops" },
] as const;

export default async function HomePage() {
  const trending = await getTrendingProducts();
  return (
    <div className="aurora-page min-h-screen text-slate-950">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="sticky top-[4.75rem] z-40 border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
          {browseTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-slate-600 transition-colors hover:text-green-700"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="relative">
        <section className="relative isolate overflow-hidden border-b-2 border-black bg-black text-white">
          <Image src="/brand/hero-cobalt-cannabis.webp" alt="Premium cannabis flower revealed behind the High Society vault" fill priority sizes="100vw" className="object-cover object-[68%_center] opacity-70 sm:object-center" />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.7)_48%,rgba(0,0,0,.35)_100%)]" />
          <div className="relative z-20 mx-auto flex min-h-[46vh] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-green-400">High Society · Adults 21+</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.96] tracking-tight sm:text-5xl lg:text-6xl">
                Cannabis,<br /><span className="bg-green-500 px-2 text-black">considered.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                A focused collection, clear product details, and discreet local service—built for a better way to shop.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="group w-full gap-2 rounded-md !border-2 !border-white !bg-green-500 px-8 !text-black hover:!bg-green-400 sm:w-auto">
                    Shop the collection
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/drops" className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white px-7 text-sm font-bold text-white transition hover:bg-white hover:text-black">
                  View the next drop
                </Link>
              </div>
            </div>
          </div>
        </section>

        <VaultDrop />

        <section className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-black transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
                  <Image src={category.image} alt={category.imageAlt} fill sizes="80px" className="object-cover" />
                  <span className="absolute left-0 top-0 rounded-br-md bg-green-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">New</span>
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-green-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {trending.length > 0 && (
          <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase text-slate-950">Fresh Menu 🌿</h2>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-slate-950">
                Shop everything <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {["New", "On Sale", "Top Shelf", ...Array.from(new Set(trending.map((p) => p.brand).filter(Boolean)))].map((tag) => (
                <span key={tag} className="shrink-0 rounded-full border-2 border-black bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-green-50">
                  {tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {trending.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-700">The collection</p>
              <h2 className="max-w-3xl text-4xl font-black uppercase tracking-tight sm:text-5xl">
                <span className="text-slate-950">Find your format.</span>
                <span className="block pt-2 text-slate-950">Keep it <span className="bg-green-500 px-2">simple.</span></span>
              </h2>
              <p className="max-w-2xl text-lg text-slate-600">
                Six clear paths into the menu, each backed by real product imagery and useful details.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 transition-colors hover:text-slate-950">
              Shop everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative min-h-72 overflow-hidden rounded-xl border-2 border-black transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_rgba(34,197,94,1)]"
              >
                <Image src={category.image} alt={category.imageAlt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,rgba(0,0,0,.35)_48%,rgba(0,0,0,.9)_100%)]" />
                <div className="relative flex min-h-72 flex-col justify-end p-7">
                  <div className="mb-5 flex items-center justify-end">
                    <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">{category.name}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl border-2 border-black bg-white px-6 py-6 sm:px-8">
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-green-500 text-black">
                  <Zap className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-green-700">Next drop</p>
                  <h3 className="text-2xl font-black text-slate-950">Fresh menu updates. Three times a week.</h3>
                  <p className="text-sm text-slate-600">
                    The vault opens Tuesday, Thursday, and Saturday at 10am.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <DropTimer />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="min-w-[240px] flex-1 rounded-xl border-2 border-black bg-white px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-green-500 text-black">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative grid gap-8 overflow-hidden rounded-xl border-2 border-black bg-white p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-700">This week</p>
              <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
                A smaller menu.<br /><span className="bg-green-500 px-2">A better edit.</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                We keep the collection focused so quality, freshness, and product information stay easy to understand.
              </p>
            </div>
            <div className="relative rounded-xl border-2 border-black bg-slate-50 p-6">
              <div className="space-y-4">
                {[
                  "A rotating edit across core formats",
                  "Clear strengths, sizes, and options",
                  "Local service across the Twin Cities",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-700">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/products" className="mt-6 inline-flex">
                <Button size="lg" className="group gap-2 rounded-md !border-2 !border-black !bg-green-500 px-7 !text-black hover:!bg-green-400">
                  Shop the collection
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-700">High Society, beyond the shop</p>
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Learn something. <span className="bg-green-500 px-2">Meet someone.</span>
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {communityCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-xl border-2 border-black bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(34,197,94,1)]"
              >
                <div className="flex h-full flex-col gap-6">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-green-500 text-black">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">{card.eyebrow}</p>
                    <h3 className="text-3xl font-black text-slate-950">{card.title}</h3>
                    <p className="text-base leading-7 text-slate-600">{card.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-green-700 transition-colors group-hover:text-slate-950">
                    {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl border-2 border-black bg-white p-8 lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-700">Local service</p>
              <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
                Made for the <span className="bg-green-500 px-2">Twin Cities.</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" /> Saint Paul, Minneapolis & nearby metro neighborhoods
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-2 font-semibold text-green-700">
                  Delivery available Tue · Thu · Sat
                </span>
              </div>
            </div>
            <div className="relative mt-8 overflow-hidden rounded-xl border-2 border-black">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-93.2290%2C44.9137%2C-93.0490%2C44.9937&amp;layer=mapnik&amp;marker=44.9537%2C-93.1039"
                style={{ border: 0 }}
                width="100%"
                height="300"
                loading="lazy"
                title="High Society MN delivery area map"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="newsletter">
          <div className="relative grid gap-8 overflow-hidden rounded-xl border-2 border-black bg-white p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-green-700">Private list</p>
              <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
                First look.<br /><span className="bg-green-500 px-2">Better rewards.</span>
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                Get drop alerts, member offers, and service reminders without the noise.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Early drop alerts",
                  "Member-only rewards",
                  "Focused menu notes",
                  "Service-day reminders",
                ].map((item) => (
                  <div key={item} className="rounded-lg border-2 border-black bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-w-0 rounded-xl border-2 border-black bg-black p-2">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </main>

      <Footer hideNewsletter />
    </div>
  );
}
