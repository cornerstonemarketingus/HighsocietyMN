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
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main>
        <section className="relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden bg-[#050b1f] text-white">
          <Image src="/brand/hero-cobalt-cannabis.webp" alt="Premium cannabis flower revealed behind the High Society vault" fill priority sizes="100vw" className="object-cover object-[68%_center] sm:object-center" />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(3,7,24,.96)_0%,rgba(3,7,24,.82)_40%,rgba(3,7,24,.16)_76%)]" />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_55%,rgba(3,7,24,.9)_100%)]" />
          <VaultDrop />
          <div className="relative z-20 mx-auto flex min-h-[calc(100svh-4.75rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-blue-200">Saint Paul + Minneapolis · Adults 21+</p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                Cannabis,<br /><span className="text-blue-300">considered.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-blue-50/80 sm:text-xl sm:leading-8">
                A focused collection, clear product details, and discreet local service—built for a better way to shop.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="group w-full gap-2 rounded-full bg-white px-8 text-slate-950 shadow-[0_18px_55px_rgba(37,99,235,.3)] hover:bg-blue-50 sm:w-auto">
                    Shop the collection
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/drops" className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
                  View the next drop
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.15em] text-blue-100/70">
                <span>Curated weekly</span><span>Private service</span><span>ID verified</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit border-blue-100 bg-blue-50 px-4 py-1.5 text-blue-700">The collection</Badge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-slate-950">Find your format.</span>
                <span className="block pt-2 text-blue-700">Keep it simple.</span>
              </h2>
              <p className="max-w-2xl text-lg text-slate-500">
                Six clear paths into the menu, each backed by real product imagery and useful details.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">
              Shop everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative min-h-72 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-indigo-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/20"
              >
                <Image src={category.image} alt={category.imageAlt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-black/10" />
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
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-600/70">Next drop</p>
                  <h3 className="text-2xl font-semibold text-slate-950">Fresh menu updates. Three times a week.</h3>
                  <p className="text-sm text-slate-500">
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
              <Badge className="w-fit border-blue-100 bg-blue-50 px-4 py-1.5 text-blue-700">This week</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                A smaller menu.<br /><span className="text-blue-700">A better edit.</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-700">
                We keep the collection focused so quality, freshness, and product information stay easy to understand.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)]">
              <div className="space-y-4">
                {[
                  "A rotating edit across core formats",
                  "Clear strengths, sizes, and options",
                  "Local service across the Twin Cities",
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
            <Badge className="w-fit border-blue-100 bg-blue-50 px-4 py-1.5 text-blue-700">High Society, beyond the shop</Badge>
            <h2 className="text-4xl font-semibold sm:text-5xl">
              Learn something. <span className="text-blue-700">Meet someone.</span>
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
              <Badge className="w-fit border-blue-100 bg-blue-50 px-4 py-1.5 text-blue-700">Local service</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                Made for the <span className="text-blue-700">Twin Cities.</span>
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
              <Badge className="w-fit border-blue-100 bg-blue-50 px-4 py-1.5 text-blue-700">Private list</Badge>
              <h2 className="text-4xl font-semibold sm:text-5xl">
                First look.<br /><span className="text-blue-700">Better rewards.</span>
              </h2>
              <p className="text-lg leading-8 text-slate-700">
                Get drop alerts, member offers, and service reminders without the noise.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Early drop alerts",
                  "Member-only rewards",
                  "Focused menu notes",
                  "Service-day reminders",
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

      <Footer hideNewsletter />
    </div>
  );
}
