import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
    "https://images.unsplash.com/photo-1668001201519-1e5bff88bf01?w=400&q=80";

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-amber-500/50 transition-all duration-300">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/40">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
        <div className="p-4 space-y-2">
          <p className="text-xs text-amber-500 uppercase tracking-wider">
            {category.name}
          </p>
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
            {name}
          </h3>
          {thcContent !== null && thcContent !== undefined && (
            <p className="text-xs text-gray-400">THC: {thcContent}%</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-gray-500 text-sm line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button
          size="sm"
          className="w-full"
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
