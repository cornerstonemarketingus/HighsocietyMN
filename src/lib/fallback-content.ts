export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  thcContent: number | null;
  cbdContent: number | null;
  weight: number | null;
  strain: string | null;
  effects: string[];
  flavors: string[];
  terpenes: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string; description: string | null; image: string | null; sortOrder: number; createdAt: Date; updatedAt: Date };
};

const now = new Date("2026-07-22T12:00:00.000Z");
const category = (slug: string, name: string, sortOrder: number) => ({
  id: `fallback-${slug}`,
  name,
  slug,
  description: null,
  image: null,
  sortOrder,
  createdAt: now,
  updatedAt: now,
});

export const fallbackCategories = [
  category("flower", "Flower", 1),
  category("edibles", "Edibles", 2),
  category("vapes", "Vapes", 3),
  category("concentrates", "Concentrates", 4),
  category("beverages", "Beverages", 5),
  category("accessories", "Accessories", 6),
];

const cannabisImages = {
  flower: "https://images.unsplash.com/photo-1536819114556-1e10f967fb21?w=900&q=85",
  edibles: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=900&q=85",
  vapes: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=900&q=85",
  concentrates: "https://images.unsplash.com/photo-1536819114556-1e10f967fb21?w=900&q=85",
  beverages: "https://images.unsplash.com/photo-1536819114556-1e10f967fb21?w=900&q=85",
  accessories: "https://images.unsplash.com/photo-1536819114556-1e10f967fb21?w=900&q=85",
};

function product(input: Omit<StorefrontProduct, "id" | "createdAt" | "updatedAt" | "published" | "category"> & { categorySlug: string; categoryName: string; categoryOrder: number }): StorefrontProduct {
  const { categorySlug, categoryName, categoryOrder, ...rest } = input;
  return {
    id: `fallback-${rest.slug}`,
    ...rest,
    published: true,
    createdAt: now,
    updatedAt: now,
    category: category(categorySlug, categoryName, categoryOrder),
  };
}

export const fallbackProducts: StorefrontProduct[] = [
  product({ name: "Blue Dream Reserve", slug: "blue-dream-reserve", description: "A bright, berry-forward sativa-dominant flower with a polished aroma and balanced finish.", brand: "High Society Select", price: 45, comparePrice: null, images: [cannabisImages.flower], thcContent: 21.5, cbdContent: 0.1, weight: 3.5, strain: "sativa hybrid", effects: ["Uplifted", "Creative", "Relaxed"], flavors: ["Berry", "Sweet", "Herbal"], terpenes: ["Myrcene", "Pinene"], inStock: true, stockQuantity: 24, featured: true, categorySlug: "flower", categoryName: "Flower", categoryOrder: 1 }),
  product({ name: "Midnight Mints", slug: "midnight-mints", description: "Precisely dosed chocolate-mint edibles designed for a measured evening ritual. Start low and go slow.", brand: "Sweet Relief", price: 25, comparePrice: null, images: [cannabisImages.edibles], thcContent: 10, cbdContent: 0, weight: null, strain: null, effects: ["Calm", "Relaxed"], flavors: ["Mint", "Chocolate"], terpenes: [], inStock: true, stockQuantity: 38, featured: true, categorySlug: "edibles", categoryName: "Edibles", categoryOrder: 2 }),
  product({ name: "Citrus Live Resin Cart", slug: "citrus-live-resin-cart", description: "A terpene-rich live resin cartridge with vivid citrus character and a clean, discreet format.", brand: "Clear Labs", price: 42, comparePrice: 48, images: [cannabisImages.vapes], thcContent: 82, cbdContent: 0.5, weight: 0.5, strain: "sativa", effects: ["Focused", "Energetic"], flavors: ["Citrus", "Lemon"], terpenes: ["Limonene"], inStock: true, stockQuantity: 18, featured: true, categorySlug: "vapes", categoryName: "Vapes", categoryOrder: 3 }),
  product({ name: "Solventless Rosin Badder", slug: "solventless-rosin-badder", description: "Small-batch solventless concentrate with a deep terpene profile for experienced adult consumers.", brand: "Extract Artisans", price: 78, comparePrice: null, images: [cannabisImages.concentrates], thcContent: 71, cbdContent: 0.5, weight: 1, strain: "hybrid", effects: ["Euphoric", "Creative"], flavors: ["Floral", "Fruity"], terpenes: ["Caryophyllene", "Limonene"], inStock: true, stockQuantity: 12, featured: true, categorySlug: "concentrates", categoryName: "Concentrates", categoryOrder: 4 }),
  product({ name: "Lemon-Lime THC Sparkling Water", slug: "lemon-lime-thc-sparkling-water", description: "A fast-acting, lightly sparkling infused beverage with 5mg THC and 5mg CBD.", brand: "Hydro High", price: 8, comparePrice: null, images: [cannabisImages.beverages], thcContent: 5, cbdContent: 5, weight: null, strain: null, effects: ["Social", "Relaxed"], flavors: ["Lemon-Lime", "Citrus"], terpenes: [], inStock: true, stockQuantity: 60, featured: false, categorySlug: "beverages", categoryName: "Beverages", categoryOrder: 5 }),
  product({ name: "Matte Black Herb Grinder", slug: "matte-black-herb-grinder", description: "A discreet four-piece grinder with a refined matte finish and durable construction.", brand: "High Society Goods", price: 28, comparePrice: null, images: [cannabisImages.accessories], thcContent: null, cbdContent: null, weight: null, strain: null, effects: [], flavors: [], terpenes: [], inStock: true, stockQuantity: 30, featured: false, categorySlug: "accessories", categoryName: "Accessories", categoryOrder: 6 }),
];

export const fallbackBlogPosts = [
  {
    id: "fallback-journal-1",
    title: "How to Build a More Intentional Cannabis Ritual",
    slug: "intentional-cannabis-ritual",
    excerpt: "A simple guide to choosing format, dose, timing, and setting with more confidence.",
    image: cannabisImages.flower,
    content: `Cannabis feels most elevated when the experience is intentional. Start by deciding what kind of evening or moment you want to create, then choose a product format that matches it.\n\n**Choose the right format**\n\nFlower offers aroma and immediacy. Vapes are discreet and easy to pace. Edibles take longer to arrive and last longer, so careful dosing matters. Beverages can offer a polished social option with clear serving sizes.\n\n**Start low and go slow**\n\nEspecially with edibles, give the product enough time before taking more. Everyone responds differently, and patience creates a more predictable experience.\n\n**Pay attention to setting**\n\nComfort, hydration, food, music, and company all shape the experience. Build your ritual around a calm environment and avoid driving or operating machinery.\n\nHigh Society MN serves adults 21+ only. This article is educational and is not medical advice.`,
    published: true,
    publishedAt: now,
    createdAt: now,
    author: { name: "High Society Editorial", image: null },
  },
  {
    id: "fallback-journal-2",
    title: "Flower, Vapes, Edibles, or Beverages?",
    slug: "cannabis-formats-guide",
    excerpt: "A practical comparison of popular cannabis formats for adult consumers.",
    image: cannabisImages.edibles,
    content: `The best cannabis format depends on your desired pace, discretion, flavor, and duration.\n\n**Flower** emphasizes aroma, cultivar character, and ritual. **Vapes** are compact and easy to dose one small draw at a time. **Edibles** are discreet and long-lasting, but their delayed onset requires patience. **Beverages** can fit naturally into social settings and often display clear serving information.\n\nAlways read the label, understand the THC amount per serving, and avoid combining cannabis with driving. Adults 21+ only.`,
    published: true,
    publishedAt: new Date("2026-07-18T12:00:00.000Z"),
    createdAt: new Date("2026-07-18T12:00:00.000Z"),
    author: { name: "High Society Editorial", image: null },
  },
];

export function findFallbackProduct(slug: string) {
  return fallbackProducts.find((item) => item.slug === slug) ?? null;
}

export function findFallbackBlogPost(slug: string) {
  return fallbackBlogPosts.find((item) => item.slug === slug) ?? null;
}
