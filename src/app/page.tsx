import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
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

export default function HomePage() {
  return (
    <div className="aurora-page min-h-screen overflow-hidden text-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="relative">
        <div className="pointer-events-none absolute left-[-12rem] top-[55rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/15 blur-[140px]" />
        <div className="pointer-events-none absolute right-[-14rem] top-[88rem] h-[38rem] w-[38rem] rounded-full bg-cyan-400/15 blur-[150px]" />
        <div className="pointer-events-none absolute left-[30%] top-[145rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/12 blur-[150px]" />

        <section className="relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden bg-[#050505] text-white">
          <Image src="/brand/hero-cobalt-cannabis.webp" alt="Premium cannabis flower revealed behind the High Society vault" fill priority sizes="100vw" className="object-cover object-[68%_center] sm:object-center" />
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_78%_44%,rgba(0,229,255,.16),transparent_24%),radial-gradient(circle_at_58%_18%,rgba(124,58,237,.14),transparent_26%),linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.84)_42%,rgba(5,5,5,.2)_78%)]" />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_50%,#050505_100%)]" />
          <VaultDrop />
          <div className="relative z-20 mx-auto flex min-h-[calc(100svh-4.75rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/55">The High Society edit · Adults 21+</p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                Cannabis,<br /><span className="aurora-text">considered.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/68 sm:text-xl sm:leading-8">
                A focused collection, clear product details, and discreet local service—built for a better way to shop.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="group w-full gap-2 rounded-full bg-white px-8 text-[#050505] shadow-[0_18px_70px_rgba(0,229,255,.18)] hover:bg-cyan-50 sm:w-auto">
                    Shop the collection
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/drops" className="inline-flex h-12 items-center justify-center rounded-full bg-white/[.08] px-7 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14)] backdrop-blur-[30px] transition hover:bg-white/[.14]">
                  View the next drop
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.15em] text-white/45">
                <span>Curated weekly</span><span>Private service</span><span>ID verified</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300/80">The collection</p>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-white">Find your format.</span>
                <span className="aurora-text block pt-2">Keep it simple.</span>
              </h2>
              <p className="max-w-2xl text-lg text-white/50">
                Six clear paths into the menu, each backed by real product imagery and useful details.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition-colors hover:text-white">
              Shop everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="glass-card group relative min-h-72 overflow-hidden rounded-[1.75rem] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_90px_rgba(0,229,255,.13)]"
              >
                <Image src={category.image} alt={category.imageAlt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,rgba(5,5,5,.32)_48%,rgba(5,5,5,.96)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,rgba(0,229,255,.16),transparent_68%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex min-h-72 flex-col justify-end p-7">
                  <div className="mb-5 flex items-center justify-end">
                    <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/62">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-6 sm:px-8">
            <div className="pointer-events-none absolute -left-20 -top-24 h-48 w-48 rounded-full bg-emerald-400/20 blur-[70px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-24 h-52 w-52 rounded-full bg-cyan-400/20 blur-[75px]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[.07] text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-[30px]">
                  <Zap className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">Next drop</p>
                  <h3 className="text-2xl font-semibold text-white">Fresh menu updates. Three times a week.</h3>
                  <p className="text-sm text-white/48">
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
                className="glass-card min-w-[240px] flex-1 rounded-2xl px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[.06] text-cyan-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-white/45">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="glass-panel relative grid gap-8 overflow-hidden rounded-[2rem] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-violet-500/20 blur-[110px]" />
            <div className="pointer-events-none absolute bottom-[-8rem] left-[30%] h-64 w-64 rounded-full bg-cyan-400/14 blur-[100px]" />
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300/80">This week</p>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                A smaller menu.<br /><span className="aurora-text">A better edit.</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/55">
                We keep the collection focused so quality, freshness, and product information stay easy to understand.
              </p>
            </div>
            <div className="relative rounded-[1.75rem] bg-black/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-[32px]">
              <div className="space-y-4">
                {[
                  "A rotating edit across core formats",
                  "Clear strengths, sizes, and options",
                  "Local service across the Twin Cities",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-white/68">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
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

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300/75">High Society, beyond the shop</p>
            <h2 className="text-4xl font-semibold sm:text-5xl">
              Learn something. <span className="aurora-text">Meet someone.</span>
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {communityCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="glass-card group relative overflow-hidden rounded-[1.75rem] p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(124,58,237,.14)]"
              >
                <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-violet-500/15 blur-[70px] transition group-hover:bg-cyan-400/15" />
                <div className="flex h-full flex-col gap-6">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[.06] text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,.1)]">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-violet-300/70">{card.eyebrow}</p>
                    <h3 className="text-3xl font-semibold text-white">{card.title}</h3>
                    <p className="text-base leading-7 text-white/48">{card.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition-colors group-hover:text-white">
                    {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 lg:p-10">
            <div className="pointer-events-none absolute -left-24 bottom-[-9rem] h-72 w-72 rounded-full bg-emerald-400/16 blur-[100px]" />
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300/75">Local service</p>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                Made for the <span className="aurora-text">Twin Cities.</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/58">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-300" /> Saint Paul, Minneapolis & nearby metro neighborhoods
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-2 text-emerald-200/80">
                  Delivery available Tue · Thu · Sat
                </span>
              </div>
            </div>
            <div className="relative mt-8 overflow-hidden rounded-[1.5rem] bg-white/[.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.1)]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-93.2290%2C44.9137%2C-93.0490%2C44.9937&amp;layer=mapnik&amp;marker=44.9537%2C-93.1039"
                style={{ border: 0 }}
                width="100%"
                height="300"
                loading="lazy"
                title="High Society MN delivery area map"
                className="rounded-[1.25rem] opacity-80 saturate-[.6]"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="newsletter">
          <div className="glass-panel relative grid gap-8 overflow-hidden rounded-[2rem] p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
            <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-pink-500/12 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-24 left-[35%] h-64 w-64 rounded-full bg-cyan-400/15 blur-[100px]" />
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-pink-300/75">Private list</p>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                First look.<br /><span className="aurora-text">Better rewards.</span>
              </h2>
              <p className="text-lg leading-8 text-white/55">
                Get drop alerts, member offers, and service reminders without the noise.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Early drop alerts",
                  "Member-only rewards",
                  "Focused menu notes",
                  "Service-day reminders",
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/[.045] px-4 py-3 text-sm text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,.07)] backdrop-blur-[30px]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-w-0 rounded-[1.75rem] bg-black/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-[32px]">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </main>

      <Footer hideNewsletter />
    </div>
  );
}
