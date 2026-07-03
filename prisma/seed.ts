import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const categories = [
  { name: "Flower", slug: "flower", description: "Premium hand-selected cannabis flower", sortOrder: 1 },
  { name: "Edibles", slug: "edibles", description: "Precisely dosed infused treats", sortOrder: 2 },
  { name: "Vapes", slug: "vapes", description: "Discreet, convenient cartridges", sortOrder: 3 },
  { name: "Concentrates", slug: "concentrates", description: "High-potency extracts", sortOrder: 4 },
  { name: "Beverages", slug: "beverages", description: "Cannabis-infused drinks", sortOrder: 5 },
  { name: "Accessories", slug: "accessories", description: "Tools & essentials", sortOrder: 6 },
];

const products = [
  {
    name: "Blue Dream",
    slug: "blue-dream",
    categorySlug: "flower",
    description: "A sativa-dominant hybrid with full-body relaxation and gentle cerebral invigoration. Sweet berry aroma.",
    brand: "Cultivar Co.",
    price: 45.00,
    thcContent: 21.5,
    cbdContent: 0.1,
    weight: 3.5,
    strain: "sativa",
    effects: ["Relaxed", "Happy", "Creative"],
    flavors: ["Berry", "Sweet", "Vanilla"],
    stockQuantity: 50,
    images: ["https://images.unsplash.com/photo-1668001201519-1e5bff88bf01?w=400&q=80"],
    featured: true,
  },
  {
    name: "OG Kush",
    slug: "og-kush",
    categorySlug: "flower",
    description: "A classic indica-dominant strain known for its complex aroma with notes of fuel, skunk, and spice.",
    brand: "Heritage Farms",
    price: 50.00,
    thcContent: 24.0,
    cbdContent: 0.1,
    weight: 3.5,
    strain: "indica",
    effects: ["Relaxed", "Sleepy", "Euphoric"],
    flavors: ["Earthy", "Pine", "Woody"],
    stockQuantity: 30,
    images: ["https://images.unsplash.com/photo-1606103836293-0a063ec4f1d9?w=400&q=80"],
    featured: true,
  },
  {
    name: "Strawberry Cough",
    slug: "strawberry-cough",
    categorySlug: "flower",
    description: "Sativa with a sweet strawberry taste and an uplifting, social high.",
    brand: "Cultivar Co.",
    price: 42.00,
    thcContent: 18.5,
    cbdContent: 0.2,
    weight: 3.5,
    strain: "sativa",
    effects: ["Uplifted", "Happy", "Energetic"],
    flavors: ["Strawberry", "Sweet", "Berry"],
    stockQuantity: 25,
    images: ["https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80"],
    featured: false,
  },
  {
    name: "Midnight Mints",
    slug: "midnight-mints",
    categorySlug: "edibles",
    description: "10mg THC per mint. 10 mints per package. Perfect for precise micro-dosing.",
    brand: "Sweet Relief",
    price: 25.00,
    thcContent: 10.0,
    cbdContent: 0.0,
    strain: null,
    effects: ["Relaxed", "Sleepy"],
    flavors: ["Mint", "Chocolate"],
    stockQuantity: 100,
    images: ["https://images.unsplash.com/photo-1605003858809-81cb9e9a4d3c?w=400&q=80"],
    featured: true,
  },
  {
    name: "Mango Gummies",
    slug: "mango-gummies",
    categorySlug: "edibles",
    description: "5mg THC per gummy. 20 gummies per bag. Tropical mango flavor.",
    brand: "Sweet Relief",
    price: 22.00,
    thcContent: 5.0,
    cbdContent: 0.0,
    strain: null,
    effects: ["Happy", "Relaxed"],
    flavors: ["Mango", "Tropical", "Sweet"],
    stockQuantity: 80,
    images: ["https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80"],
    featured: false,
  },
  {
    name: "Sativa Clarity Cart",
    slug: "sativa-clarity-cart",
    categorySlug: "vapes",
    description: "Live resin cartridge with a sativa blend. 0.5g. Bright citrus terpene profile.",
    brand: "Clear Labs",
    price: 40.00,
    thcContent: 85.0,
    cbdContent: 0.5,
    strain: "sativa",
    effects: ["Energetic", "Creative", "Focused"],
    flavors: ["Citrus", "Lemon", "Orange"],
    stockQuantity: 60,
    images: ["https://images.unsplash.com/photo-1559181567-c3190bbe4f1f?w=400&q=80"],
    featured: true,
  },
  {
    name: "Indica Dream Cart",
    slug: "indica-dream-cart",
    categorySlug: "vapes",
    description: "Full-spectrum indica cartridge. 1g. Deep relaxation with earthy pine notes.",
    brand: "Clear Labs",
    price: 55.00,
    thcContent: 82.0,
    cbdContent: 1.0,
    strain: "indica",
    effects: ["Relaxed", "Sleepy", "Calm"],
    flavors: ["Pine", "Earthy", "Wood"],
    stockQuantity: 45,
    images: ["https://images.unsplash.com/photo-1559181567-c3190bbe4f1f?w=400&q=80"],
    featured: false,
  },
  {
    name: "Live Rosin Badder",
    slug: "live-rosin-badder",
    categorySlug: "concentrates",
    description: "Premium solventless live rosin. Rich terpene profile. For experienced consumers.",
    brand: "Extract Artisans",
    price: 80.00,
    thcContent: 72.0,
    cbdContent: 0.5,
    weight: 1.0,
    strain: "hybrid",
    effects: ["Euphoric", "Creative", "Focused"],
    flavors: ["Floral", "Fruity", "Sweet"],
    stockQuantity: 20,
    images: ["https://images.unsplash.com/photo-1606103836293-0a063ec4f1d9?w=400&q=80"],
    featured: true,
  },
  {
    name: "Cannabis Sparkling Water",
    slug: "cannabis-sparkling-water",
    categorySlug: "beverages",
    description: "5mg THC + 5mg CBD sparkling water. Lemon-lime flavor. Fast-acting nano-emulsion.",
    brand: "Hydro High",
    price: 8.00,
    thcContent: 5.0,
    cbdContent: 5.0,
    strain: null,
    effects: ["Relaxed", "Happy"],
    flavors: ["Lemon-Lime", "Citrus", "Refreshing"],
    stockQuantity: 200,
    images: ["https://images.unsplash.com/photo-1559181567-c3190bbe4f1f?w=400&q=80"],
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
    console.log(`✓ Category: ${cat.name}`);
  }

  // Create products
  for (const product of products) {
    const { categorySlug, ...productData } = product;
    await db.product.upsert({
      where: { slug: product.slug },
      update: { ...productData, categoryId: categoryMap[categorySlug] },
      create: { ...productData, categoryId: categoryMap[categorySlug], inStock: true, published: true },
    });
    console.log(`✓ Product: ${product.name}`);
  }

  // Create admin user
  const adminPassword = await bcrypt.hash("admin1234", 12);
  await db.user.upsert({
    where: { email: "admin@highsocietymn.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@highsocietymn.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user: admin@highsocietymn.com / admin1234");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
