"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

type Product = {
  readonly name: string;
  readonly slug: string;
  readonly image: string;
  readonly type: string;
  readonly thc: string;
  readonly price: string;
  readonly effects: readonly string[];
  readonly flavor: string;
};

export function ProductCarousel({ products }: { products: readonly Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: number) => track.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.82, 540), behavior: "smooth" });

  return (
    <section id="vault-collection" className="relative scroll-mt-28 overflow-hidden bg-[#080807] pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 vault-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fresh on the menu</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">Good herb.<br /><span className="text-[#e5a12b]">Better nights.</span></h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => move(-1)} className="carousel-control" aria-label="Previous product"><ArrowLeft className="h-5 w-5" /></button>
            <button onClick={() => move(1)} className="carousel-control" aria-label="Next product"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
        <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.length === 0 && <div className="flex min-h-72 w-full items-center justify-center border border-white/10 bg-[#11110f] text-sm text-zinc-500">Fresh goods are on the way. Check back soon.</div>}
          {products.map((product, index) => (
            <article key={product.slug} className="group grid min-w-[88%] snap-start overflow-hidden border border-white/10 bg-[#11110f] sm:min-w-[620px] md:grid-cols-[1.05fr_0.95fr] lg:min-w-[760px]">
              <Link href={`/products/${product.slug}`} className="relative min-h-[330px] overflow-hidden md:min-h-[480px]">
                <Image src={product.image} alt={product.name} fill priority={index < 2} sizes="(max-width: 768px) 90vw, 440px" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                <span className="absolute left-5 top-5 border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] uppercase text-white backdrop-blur">Fresh pick</span>
              </Link>
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <div><p className="text-xs uppercase text-[#e5a12b]">{product.type}</p><h2 className="mt-2 text-3xl font-medium">{product.name}</h2></div>
                    <p className="text-xl text-[#ffc263]">{product.price}</p>
                  </div>
                  <dl className="divide-y divide-white/10 text-sm">
                    <div className="flex justify-between gap-4 py-4"><dt className="text-zinc-500">Potency</dt><dd>{product.thc}</dd></div>
                    <div className="py-4"><dt className="mb-3 text-zinc-500">Expected effects</dt><dd className="flex flex-wrap gap-2">{product.effects.map(effect => <span key={effect} className="border border-[#8a5710]/30 px-2.5 py-1 text-xs text-[#ffc263]">{effect}</span>)}</dd></div>
                    <div className="flex justify-between gap-4 py-4"><dt className="text-zinc-500">Flavor</dt><dd className="text-right text-zinc-300">{product.flavor}</dd></div>
                  </dl>
                </div>
                <Link href={`/products/${product.slug}`} className="mt-6 inline-flex h-11 items-center justify-center gap-2 bg-[#e5a12b] px-5 text-sm font-semibold text-black hover:bg-[#ffc263]">Peep the details <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-600 sm:hidden">Swipe through the fresh picks</p>
      </div>
    </section>
  );
}
