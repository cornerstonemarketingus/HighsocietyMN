import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice } from "@/lib/utils";
import { usableProductImages } from "@/lib/product-images";

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
  id,
  name,
  slug,
  price,
  comparePrice,
  images,
  category,
  thcContent,
  inStock,
}: ProductCardProps) {
  const imageUrl = usableProductImages(images, category.name)[0];
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  return (
    <article className="group relative overflow-hidden border border-white/10 bg-[#11110f] transition-colors hover:border-[#e5a12b]/55">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/40">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="danger">Out of Stock</Badge>
            </div>
          )}
          {comparePrice && comparePrice > price && (
            <div className="absolute top-2 left-2">
              <Badge variant="success">Sale</Badge>
            </div>
          )}
        </div>
        <div className="space-y-3 p-4">
          <p className="text-[10px] uppercase text-[#e5a12b]">
            {category.name}{thcContent != null ? ` · ${thcContent}% THC` : ""}
          </p>
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <span className="font-semibold text-[#ffc263]">
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price ? (
              <span className="text-gray-500 text-sm line-through">
                {formatPrice(comparePrice)}
              </span>
            ) : <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-[#e5a12b]" />}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4"><AddToCartButton productId={id} inStock={inStock} className="w-full rounded-none bg-[#e5a12b] text-black hover:bg-[#ffc263]" /></div>
    </article>
  );
}
