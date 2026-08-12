import Image from "next/image";
import Link from "next/link";
import { Check, BadgeCheck, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export interface ProductCardProps {
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
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-black hover:shadow-[6px_6px_0_0_rgba(34,197,94,1)]">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden border-b border-slate-200 bg-slate-50 group-hover:border-black">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized={imageUrl.startsWith("data:")}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {thcContent !== null && thcContent !== undefined && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black px-1.5 py-0.5 text-[0.68rem] font-bold text-green-400">
              {thcContent}% THC
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90">
              <Badge variant="danger">Out of Stock</Badge>
            </div>
          )}
          {comparePrice && comparePrice > price && (
            <div className="absolute top-1.5 left-1.5">
              <Badge variant="success">Sale</Badge>
            </div>
          )}
        </div>

        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-950 group-hover:text-green-700">
            {name}
          </h3>
          {(brand || !!unitsSold) && (
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              {brand ? (
                <span className="flex items-center gap-1">
                  {brand} <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                </span>
              ) : <span />}
              {!!unitsSold && (
                <span className="flex items-center gap-1 shrink-0">
                  <Flame className="h-3.5 w-3.5 text-green-600" /> {unitsSold} sold
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-[0.14em]">{category.name}</span>
            <span className="flex items-center gap-1.5 font-black text-slate-950">
              {variantPrices.length ? "From " : ""}{formatPrice(displayPrice)}
              {comparePrice && comparePrice > price && (
                <span className="font-normal text-slate-400 line-through">{formatPrice(comparePrice)}</span>
              )}
            </span>
          </div>
        </div>
      </Link>
      {!inStock && (
        <span className="mb-3 ml-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Check className="h-3.5 w-3.5" /> Check back soon
        </span>
      )}
    </article>
  );
}
