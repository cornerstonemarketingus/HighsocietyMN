import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Star, Shield, Truck, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const categories = [
  { name: "Flower", slug: "flower", emoji: "🌿", desc: "Premium hand-selected cannabis flower" },
  { name: "Edibles", slug: "edibles", emoji: "🍫", desc: "Precisely dosed infused treats" },
  { name: "Vapes", slug: "vapes", emoji: "💨", desc: "Discreet, convenient cartridges" },
  { name: "Concentrates", slug: "concentrates", emoji: "⚗️", desc: "High-potency extracts" },
  { name: "Beverages", slug: "beverages", emoji: "🥤", desc: "Cannabis-infused drinks" },
  { name: "Accessories", slug: "accessories", emoji: "🔧", desc: "Tools & essentials" },
];

const features = [
  {
    icon: Shield,
    title: "Lab Tested",
    desc: "All products are third-party tested for purity and potency.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Curated selection from Minnesota's top producers.",
  },
  {
    icon: Clock,
    title: "Ready Pickup",
    desc: "Order online and pick up same day, hassle-free.",
  },
  {
    icon: Truck,
    title: "Fast & Easy",
    desc: "Streamlined ordering for a seamless experience.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <Badge className="text-sm px-4 py-1.5">
              🌿 Minnesota&apos;s Premier Cannabis Dispensary
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Elevate Your{" "}
              <span className="text-amber-400">Experience</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Discover premium cannabis products thoughtfully curated for
              Minnesota&apos;s discerning community. Quality, transparency,
              and sophistication in every purchase.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Shop All Products <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=flower">
                <Button size="lg" variant="outline">
                  Browse Flower
                </Button>
              </Link>
            </div>
            <p className="text-xs text-gray-600">
              ⚠️ Must be 21+ to purchase. Valid ID required at pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="space-y-3 p-6 rounded-xl border border-white/10 bg-white/5">
              <f.icon className="h-7 w-7 text-amber-500" />
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Shop by Category</h2>
            <p className="mt-2 text-gray-400">
              Something for every experience level
            </p>
          </div>
          <Link href="/products" className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-white font-medium text-sm">{cat.name}</span>
              <span className="text-gray-500 text-xs hidden sm:block">
                {cat.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-black p-10 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to elevate your experience?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Create your account for faster checkout, order history, and
            exclusive member deals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
