import Image from "next/image";
import Link from "next/link";
import { Play, Check, BadgeCheck, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  category: { name: string };
  brand?: string | null;
  thcContent?: number | null;
  inStock: boolean;
  featured?: boolean;
  variants?: unknown;
  unitsSold?: number;
}

export function ProductCard({
  name,
  slug,
  price,
  comparePrice,
  images,
  category,
  brand,
  thcContent,
  inStock,
  variants,
  unitsSold,
}: ProductCardProps) {
  const imageUrl =
    images[0] ??
    "/categories/flower.webp";
  const variantPrices = Array.isArray(variants)
    ? variants
        .map((variant) =>
          typeof variant === "object" && variant !== null && "price" in variant
            ? Number(variant.price)
            : Number.NaN,
        )
        .filter(Number.isFinite)
    : [];
  const displayPrice = variantPrices.length ? Math.min(price, ...variantPrices) : price;

  return (
    <article className="group relative">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/[.06] transition-all duration-300 group-hover:ring-orange-500/60">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized={imageUrl.startsWith("data:")}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 shadow-[0_0_25px_rgba(255,145,0,.55)]">
              <Play className="h-5 w-5 translate-x-0.5 fill-black text-black" />
            </div>
          </div>
          {thcContent !== null && thcContent !== undefined && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[0.68rem] font-semibold text-orange-400">
              {thcContent}% THC
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75">
              <Badge variant="danger">Out of Stock</Badge>
            </div>
          )}
          {comparePrice && comparePrice > price && (
            <div className="absolute top-1.5 left-1.5">
              <Badge variant="success">Sale</Badge>
            </div>
          )}
        </div>

        <div className="mt-2.5 space-y-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-100 group-hover:text-orange-400">
            {name}
          </h3>
          {(brand || !!unitsSold) && (
            <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
              {brand ? (
                <span className="flex items-center gap-1">
                  {brand} <BadgeCheck className="h-3.5 w-3.5 text-orange-500" />
                </span>
              ) : <span />}
              {!!unitsSold && (
                <span className="flex items-center gap-1 shrink-0">
                  <Flame className="h-3.5 w-3.5 text-orange-500" /> {unitsSold} sold
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
            <span className="uppercase tracking-[0.14em]">{category.name}</span>
            <span className="flex items-center gap-1.5 font-semibold text-white">
              {variantPrices.length ? "From " : ""}{formatPrice(displayPrice)}
              {comparePrice && comparePrice > price && (
                <span className="text-neutral-500 line-through">{formatPrice(comparePrice)}</span>
              )}
            </span>
          </div>
        </div>
      </Link>
      {!inStock && (
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Check className="h-3.5 w-3.5" /> Check back soon
        </span>
      )}
    </article>
  );
}
