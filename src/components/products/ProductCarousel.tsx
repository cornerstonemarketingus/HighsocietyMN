"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

const AUTOPLAY_MS = 4500;
const RESUME_AFTER_INTERACTION_MS = 8000;

export function ProductCarousel({ products }: { products: ProductCardProps[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((targetIndex: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.children[targetIndex] as HTMLElement | undefined;
    if (!scroller || !card) return;
    scroller.scrollTo({ left: card.offsetLeft - scroller.offsetLeft, behavior: "smooth" });
  }, []);

  const pauseThenResume = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER_INTERACTION_MS);
  }, []);

  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  useEffect(() => {
    if (paused || products.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % products.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, products.length, scrollToIndex]);

  function go(direction: 1 | -1) {
    pauseThenResume();
    setIndex((current) => {
      const next = (current + direction + products.length) % products.length;
      scrollToIndex(next);
      return next;
    });
  }

  function goTo(targetIndex: number) {
    pauseThenResume();
    setIndex(targetIndex);
    scrollToIndex(targetIndex);
  }

  if (products.length === 0) return null;

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={pauseThenResume}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-16" />

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[64%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]">
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous product"
            className="absolute left-0 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white p-2.5 opacity-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:bg-green-50 group-hover/carousel:opacity-100 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next product"
            className="absolute right-0 top-[38%] hidden translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white p-2.5 opacity-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:bg-green-50 group-hover/carousel:opacity-100 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex justify-center gap-1.5">
            {products.map((product, dotIndex) => (
              <button
                key={product.id}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Go to product ${dotIndex + 1}`}
                className={`h-1.5 rounded-full transition-all ${dotIndex === index ? "w-6 bg-green-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
