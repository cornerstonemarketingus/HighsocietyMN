import snapshot from "@/data/live-catalog.json";
import { usableProductImages } from "@/lib/product-images";

export type CatalogProduct = {
  id: string; name: string; slug: string; description: string | null; brand: string | null;
  price: number; comparePrice: number | null; images: string[]; thcContent: number | null;
  cbdContent: number | null; weight: number | null; strain: string | null; effects: string[];
  flavors: string[]; terpenes: string[]; inStock: boolean; featured: boolean;
  category: { id: string; name: string; slug: string };
};

function decodeText(value: string | null | undefined) {
  return value?.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&") ?? null;
}

export const LIVE_CATALOG: CatalogProduct[] = snapshot.map(({ product, category }) => {
  const images = usableProductImages(product.images, category.name);
  return {
    id: `live-${product.slug}`,
    name: product.name,
    slug: product.slug,
    description: decodeText(product.description),
    brand: product.brand,
    price: product.price,
    comparePrice: product.comparePrice,
    images,
    thcContent: product.thcContent,
    cbdContent: product.cbdContent,
    weight: product.weight,
    strain: product.strain,
    effects: product.effects,
    flavors: product.flavors,
    terpenes: product.terpenes,
    inStock: product.inStock,
    featured: product.featured,
    category: { id: `live-category-${category.slug}`, name: category.name, slug: category.slug },
  };
});

export const LIVE_CATEGORIES = Array.from(new Map(LIVE_CATALOG.map(product => [product.category.slug, product.category])).values());

export function liveProduct(slug: string) {
  return LIVE_CATALOG.find(product => product.slug === slug) ?? null;
}
