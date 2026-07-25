import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { DropTimer } from "@/components/DropTimer";
import { VaultDrop } from "@/components/VaultDrop";
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
  Sparkles,
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
    description: "Velvet-smooth cultivars selected for aroma, nuance, and elevated evenings.",
  },
  {
    name: "Edibles",
    slug: "edibles",
    image: "/categories/edibles.webp",
    imageAlt: "Mitten Extracts gummies from the High Society MN catalog",
    description: "Chef-inspired confections with precise dosing and boutique presentation.",
  },
  {
    name: "Vapes",
    slug: "vapes",
    image: "/categories/vapes.webp",
    imageAlt: "Sweetcarts vape from the High Society MN catalog",
    description: "Refined terpene-rich cartridges for clean flavor and effortless luxury.",
  },
  {
    name: "Concentrates",
    slug: "concentrates",
    image: "/categories/concentrates.webp",
    imageAlt: "Premium hash bar from the High Society MN catalog",
    description: "High-potency extracts crafted for enthusiasts who appreciate depth.",
  },
  {
    name: "Beverages",
    slug: "beverages",
    image: "/categories/beverages.webp",
    imageAlt: "Oliphant Brewing THC beverage from the High Society MN catalog",
    description: "Sparkling, sip-worthy infusions made for polished social rituals.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/categories/accessories.webp",
    imageAlt: "Infuzed by Society product from the High Society MN catalog",
    description: "Elegant essentials that complete a curated and discreet experience.",
  },
] as const;

const trustItems = [
  { icon: Shield, title: "Lab Tested", detail: "Verified purity" },
  { icon: Crown, title: "Premium Quality", detail: "Curated selection" },
  { icon: Truck, title: "Fast Delivery", detail: "Tue · Thu · Sat" },
  { icon: Package, title: "Discreet Packaging", detail: "Private arrival" },
] as const;

const communityCards = [
  {
    href: "/blog",
    icon: BookOpen,
    eyebrow: "Editorial",
    title: "Read the journal",
    description:
      "Explore refined guides, terpene spotlights, and product stories tailored to Minnesota connoisseurs.",
    cta: "Explore the blog",
  },
  {
    href: "/forum",
    icon: MessageSquare,
    eyebrow: "Community",
    title: "Join the conversation",
    description:
      "Connect with a thoughtful local circle sharing recommendations, rituals, and elevated experiences.",
    cta: "Visit the forum",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main>
        <section className="relative isolate overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_24%),linear-gradient(135deg,#eef2ff_0%,#f8fafc_42%,#f8fafc_100%)]" />
          <div className="absolute inset-0 animate-shimmer opacity-60" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
            <div className="max-w-3xl space-y-8">
              <Badge className="w-fit gap-2 border-indigo-200 bg-white px-2.5 py-2 pr-4 text-sm font-semibold text-indigo-800 shadow-[0_10px_30px_rgba(79,70,229,0.10)]">
                <span className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-indigo-100">
                  <Image src="/categories/flower.webp" alt="" fill sizes="28px" className="object-cover" />
                </span>
                Saint Paul & Minneapolis Delivery
              </Badge>
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.4em] text-indigo-600/80">
                  Premium Cannabis Boutique
                </p>
                <h1 className="text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">
                  <span className="block text-slate-950">Luxury cannabis,</span>
                  <span className="block bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    delivered with intention.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                  Discover a polished collection of flower, edibles, vapes, and concentrates curated for elevated routines across Saint Paul and Minneapolis.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="group gap-2 rounded-full border border-indigo-300/20 bg-indigo-600 px-8 text-base text-white shadow-[0_18px_50px_rgba(79,70,229,0.22)] transition-transform hover:-translate-y-0.5"
                  >
                    Shop our collection
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>21+ verified</span>
                <span className="h-1 w-1 rounded-full bg-indigo-300" />
                <span>Private service</span>
                <span className="h-1 w-1 rounded-full bg-indigo-300" />
                <span>Twin Cities local</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  "Curated premium assortment",
                  "Discreet delivery windows",
                  "21+ only · ID verified at delivery",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:justify-end">
              <div className="absolute h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl animate-glow" />
              <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-indigo-300/20 bg-slate-50 backdrop-blur-xl" />
              <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(79,70,229,0.18),transparent_42%,rgba(255,255,255,0.04))]" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-indigo-700">
                      Curated for connoisseurs
                    </span>
                    <Sparkles className="h-5 w-5 text-indigo-600 animate-float" />
                  </div>

                  <VaultDrop />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-600/70">Next service window</p>
                      <p className="mt-2 text-lg font-medium text-slate-950">Tue · Thu · Sat</p>
                      <p className="text-sm text-slate-500">Fresh drops delivered at 10am.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-600/70">Metro coverage</p>
                      <p className="mt-2 text-lg font-medium text-slate-950">Saint Paul + Minneapolis</p>
                      <p className="text-sm text-slate-500">Boutique service with discreet arrival.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit border-slate-200 bg-slate-50 px-4 py-1.5 text-indigo-700">Shop by Category</Badge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                  Build your ritual
                </span>
                <span className="block pt-2 text-slate-950">from our signature collection.</span>
              </h2>
              <p className="max-w-2xl text-lg text-slate-500">
                Explore standout formats crafted for every mood, from intimate evenings to social pours.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">
              View all categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative min-h-72 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-indigo-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/20"
              >
                <Image src={category.image} alt={category.imageAlt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-black/10" />
                <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-900">0{index + 1}</div>
                <div className="relative flex min-h-72 flex-col justify-end p-7">
                  <div className="mb-5 flex items-center justify-end">
                    <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-50">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[1.75rem] border border-indigo-400/30 bg-[linear-gradient(135deg,rgba(79,70,229,0.18),rgba(255,255,255,0.03),rgba(0,0,0,0.7))] p-[1px] shadow-[0_10px_40px_rgba(79,70,229,0.12)]">
            <div className="flex flex-col gap-6 rounded-[1.7rem] bg-white/95 px-6 py-6 backdrop-blur-xl sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-600">
                  <Zap className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-indigo-600/70">Drop Timer</p>
                  <h3 className="text-2xl font-semibold text-slate-950">New drops delivered Tue · Thu · Sat @ 10am</h3>
                  <p className="text-sm text-slate-500">
                    Count down to the next release and secure the week&apos;s most coveted menu additions.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <DropTimer />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="min-w-[240px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[2rem] border border-indigo-100 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(238,242,255,0.92),rgba(224,231,255,0.72))] p-8 shadow-[0_24px_70px_-48px_rgba(79,70,229,0.45)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div className="min-w-0 space-y-5">
              <Badge className="w-fit border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-indigo-700">Featured Collection</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                Discover this week&apos;s <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">premium selection</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-700">
                From signature flower to polished edible experiences, each release is selected for taste, consistency, and elevated presentation.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)]">
              <div className="space-y-4">
                {[
                  "Rotating craft flower and infused essentials",
                  "Fresh menu updates aligned with every drop window",
                  "Delivery tailored to Saint Paul & Minneapolis metro",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-700">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/products" className="mt-6 inline-flex">
                <Button size="lg" className="group gap-2 rounded-full px-7">
                  Shop the collection
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <Badge className="w-fit border-slate-200 bg-slate-50 px-4 py-1.5 text-indigo-700">Community</Badge>
            <h2 className="text-4xl font-semibold sm:text-5xl">
              Beyond the menu, <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">join the culture.</span>
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {communityCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <div className="flex h-full flex-col gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-600">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-600/70">{card.eyebrow}</p>
                    <h3 className="text-3xl font-semibold text-slate-950">{card.title}</h3>
                    <p className="text-base leading-7 text-slate-500">{card.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-indigo-700 transition-colors group-hover:text-indigo-100">
                    {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 backdrop-blur-sm lg:p-10">
            <div className="space-y-4">
              <Badge className="w-fit border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-indigo-700">Delivery Coverage</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                Delivery Area: <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">Saint Paul & Minneapolis Metro</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                  <MapPin className="h-4 w-4 text-indigo-600" /> Saint Paul, Minneapolis & nearby metro neighborhoods
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-indigo-700">
                  🚗 Delivery available Tue · Thu · Sat
                </span>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-indigo-500/30">
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

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="newsletter">
          <div className="grid gap-8 rounded-[2rem] border border-indigo-100 bg-[linear-gradient(135deg,rgba(238,242,255,0.96),rgba(255,255,255,1),rgba(224,231,255,0.74))] p-8 shadow-[0_24px_70px_-48px_rgba(79,70,229,0.45)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
            <div className="min-w-0 space-y-5">
              <Badge className="w-fit border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-indigo-700">Rewards & Updates</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                Join our <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">rewards program</span>
              </h2>
              <p className="text-lg leading-8 text-slate-700">
                Unlock first access to coveted drops, members-only offers, and curated delivery alerts tailored to your taste.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Priority drop notifications",
                  "Exclusive rewards for repeat orders",
                  "Private menu highlights",
                  "Delivery reminders for Tue · Thu · Sat",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-2">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
