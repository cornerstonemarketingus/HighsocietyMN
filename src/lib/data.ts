export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  thc: number;
  cbd: number;
  effects: string[];
  terpenes: string[];
  image: string;
  description: string;
  inventory: number;
};

const categories = ["Flower", "Edibles", "Vapes", "Concentrates", "Beverages", "Accessories"];
const effects = ["Relaxed", "Focused", "Euphoric", "Sleepy", "Creative", "Energetic"];
const terpenes = ["Myrcene", "Limonene", "Pinene", "Caryophyllene"];

export const products: Product[] = Array.from({ length: 120 }, (_, index) => {
  const category = categories[index % categories.length];
  const effectA = effects[index % effects.length];
  const effectB = effects[(index + 2) % effects.length];

  return {
    id: String(index + 1),
    name: `${category} Reserve #${index + 1}`,
    category,
    price: Number((18 + (index % 17) * 2.5).toFixed(2)),
    thc: 12 + (index % 18),
    cbd: Number((0.2 + (index % 7) * 0.4).toFixed(1)),
    effects: [effectA, effectB],
    terpenes: [terpenes[index % terpenes.length], terpenes[(index + 1) % terpenes.length]],
    image: `https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=900&q=80`,
    description: `Premium ${category.toLowerCase()} crafted for Minnesota connoisseurs.`,
    inventory: 5 + (index % 40),
  };
});

export const blogPosts = [
  {
    id: "1",
    title: "Top Minnesota-Friendly Evening Strains",
    slug: "evening-strains",
    excerpt: "Wind down with terpene-rich products perfect for after work.",
    content: "## Evening Picks\nOur AI-selected evening lineup emphasizes relaxing effects and balanced cannabinoid profiles.",
    tags: ["strains", "wellness"],
  },
  {
    id: "2",
    title: "How to Choose THC/CBD Ratios",
    slug: "thc-cbd-guide",
    excerpt: "A practical guide for first-time and returning shoppers.",
    content: "## Ratio Basics\nStart low and go slow. Balance THC intensity with CBD support.",
    tags: ["education", "guide"],
  },
];

export const forumCategories = ["Strains", "Consumption Methods", "Events", "General"];
