import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
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
  thcContent?: number | null;
  inStock: boolean;
  featured?: boolean;
}

export function ProductCard({
  name,
  slug,
  price,
  comparePrice,
  images,
  category,
  thcContent,
  inStock,
}: ProductCardProps) {
  const imageUrl =
    images[0] ??
    "/categories/flower.webp";

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_14px_45px_-32px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_24px_60px_-30px_rgba(79,70,229,0.35)]">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[4/4.35] overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized={imageUrl.startsWith("data:")}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/25 to-transparent" />
          {!inStock && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
              <Badge variant="danger">Out of Stock</Badge>
            </div>
          )}
          {comparePrice && comparePrice > price && (
            <div className="absolute top-2 left-2">
              <Badge variant="success">Sale</Badge>
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-indigo-600">
            {category.name}
          </p>
          <h3 className="min-h-12 text-base font-semibold leading-snug text-slate-950 line-clamp-2 sm:text-lg">
            {name}
          </h3>
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-950">
              {formatPrice(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>
            {thcContent !== null && thcContent !== undefined && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[0.68rem] font-semibold text-indigo-700">
                {thcContent}% THC
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5">
        {inStock ? (
          <Link href={`/products/${slug}`}>
            <span className="inline-flex h-9 w-full items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              View product <ArrowUpRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        ) : (
          <span className="inline-flex h-9 w-full items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-400">
            <Check className="mr-2 h-4 w-4" /> Check back soon
          </span>
        )}
      </div>
    </article>
  );
}
