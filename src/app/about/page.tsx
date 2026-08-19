import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Crown,
  HandCoins,
  IdCard,
  PackageCheck,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About & House Rules | High Society MN",
  description:
    "Meet High Society MN and review the house rules for a discreet, straightforward cannabis delivery experience.",
};

const principles = [
  [Crown, "Quality", "A focused collection chosen for character, consistency, and a genuinely worthwhile experience."],
  [PackageCheck, "Convenience", "A simple online experience that brings the collection to you without the runaround."],
  [ShieldCheck, "Discretion", "Private ordering, considered packaging, and a respectful handoff from start to finish."],
] as const;

const rules = [
  [IdCard, "Adults only", "You must be 21 or older and present a valid government-issued ID when your order arrives."],
  [CreditCard, "Order online", "Place and pay for your order through the website. Drivers do not carry cash."],
  [UserCheck, "Be there for delivery", "The person who placed the order must be present to receive it. Orders cannot be left unattended."],
  [Scale, "Stay within legal limits", "Orders must remain within Minnesota possession limits. Larger orders may require separate deliveries."],
  [HandCoins, "All sales are final", "Please review your cart carefully before checkout. High Society does not offer refunds after a completed sale."],
  [ShieldCheck, "Safety comes first", "High Society may decline or stop a delivery when safety, identity, payment, or compliance cannot be confirmed."],
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070706] text-[#f5f1e8]">
      <Header />
      <main>
        <section className="border-b border-[#8a5710]/20 bg-[#0b0b09]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="flex items-center gap-2 text-[#e5a12b]">
              <Crown className="h-5 w-5" strokeWidth={1.5} />
              <span className="eyebrow">About High Society</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">
              Quality cannabis without the runaround.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              High Society was built for Minnesota adults who value quality, convenience, and discretion. The idea is simple: curate products worth bringing home, make ordering straightforward, and treat every delivery with care.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex h-12 items-center gap-3 bg-[#e5a12b] px-6 text-sm font-semibold text-black transition hover:bg-[#ffc263]">
                Explore the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#house-rules" className="inline-flex h-12 items-center border border-[#8a5710]/50 px-6 text-sm font-semibold text-[#ffc263] transition hover:border-[#e5a12b] hover:bg-[#e5a12b]/10">
                Read the house rules
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <p className="eyebrow">Why High Society</p>
          <div className="mt-8 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {principles.map(([Icon, title, description]) => (
              <article key={title} className="bg-[#0d0d0b] p-7 sm:p-9">
                <Icon className="h-6 w-6 text-[#e5a12b]" strokeWidth={1.5} />
                <h2 className="mt-8 text-2xl font-medium text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="house-rules" className="scroll-mt-28 border-y border-[#8a5710]/20 bg-[#0b0b09]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="eyebrow">The house rules</p>
              <h2 className="mt-3 text-3xl font-medium sm:text-5xl">Clear expectations. No surprises.</h2>
              <p className="mt-5 text-sm leading-7 text-zinc-400">
                These essentials help every order stay private, compliant, and easy for customers and drivers alike. Checkout terms apply to each purchase.
              </p>
            </div>
            <div className="mt-12 grid gap-x-12 md:grid-cols-2">
              {rules.map(([Icon, title, description]) => (
                <article key={title} className="flex gap-5 border-t border-white/10 py-7">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-[#e5a12b]" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="eyebrow">Need a hand?</p>
            <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Ask the budtender before you order.</h2>
          </div>
          <Link href="/products" className="inline-flex h-12 items-center gap-3 bg-[#e5a12b] px-6 text-sm font-semibold text-black transition hover:bg-[#ffc263]">
            Shop the menu <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
