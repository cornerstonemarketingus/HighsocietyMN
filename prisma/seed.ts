/**
 * prisma/seed.ts
 *
 * Seeds the database with real High Society MN products scraped from
 * highsocietymn.com and stored in data/products.json.
 *
 * Run with:
 *   npx prisma db seed
 *   # or directly:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 */

import { PrismaClient, ProductCategory, StrainType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawReview {
  rating: number;
  comment: string;
  verified?: boolean;
}

interface RawProduct {
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  strain?: string | null;
  thcPercentage?: number | null;
  cbdPercentage?: number | null;
  weight?: string | null;
  effects: string[];
  terpenes: string[];
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  reviews?: RawReview[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapCategory(raw: string): ProductCategory {
  const map: Record<string, ProductCategory> = {
    FLOWER: ProductCategory.FLOWER,
    EDIBLES: ProductCategory.EDIBLES,
    VAPE_CARTS: ProductCategory.VAPE_CARTS,
    CONCENTRATES: ProductCategory.CONCENTRATES,
    PRE_ROLLS: ProductCategory.PRE_ROLLS,
    TINCTURES: ProductCategory.TINCTURES,
    TOPICALS: ProductCategory.TOPICALS,
    ACCESSORIES: ProductCategory.ACCESSORIES,
    BEVERAGES: ProductCategory.BEVERAGES,
  };
  return map[raw?.toUpperCase()] ?? ProductCategory.FLOWER;
}

function mapStrain(raw?: string | null): StrainType | null {
  if (!raw) return null;
  const map: Record<string, StrainType> = {
    INDICA: StrainType.INDICA,
    SATIVA: StrainType.SATIVA,
    HYBRID: StrainType.HYBRID,
    CBD: StrainType.CBD,
  };
  return map[raw?.toUpperCase()] ?? null;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Seeding High Society MN database with real product data...\n');

  // Load scraped / curated product data
  const dataPath = path.join(__dirname, '..', 'data', 'products.json');

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Product data file not found: ${dataPath}`);
    console.error('   Run `node scripts/scrape-highsociety.js` to generate it,');
    console.error('   or ensure data/products.json exists in the repository.');
    process.exit(1);
  }

  const rawProducts: RawProduct[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📦 Loaded ${rawProducts.length} products from data/products.json`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const raw of rawProducts) {
    try {
      const productData = {
        sku: raw.sku,
        name: raw.name,
        slug: raw.slug,
        description: raw.description ?? '',
        price: typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price)) || 0,
        compareAtPrice: raw.compareAtPrice ?? null,
        category: mapCategory(raw.category),
        strain: mapStrain(raw.strain),
        thcPercentage: raw.thcPercentage ?? null,
        cbdPercentage: raw.cbdPercentage ?? null,
        weight: raw.weight ?? null,
        effects: raw.effects ?? [],
        terpenes: raw.terpenes ?? [],
        images: raw.images ?? [],
        inStock: raw.inStock !== false,
        stockQuantity: raw.stockQuantity ?? 0,
        featured: raw.featured === true,
      };

      const existing = await prisma.product.findUnique({
        where: { sku: raw.sku },
      });

      let product;
      if (existing) {
        product = await prisma.product.update({
          where: { sku: raw.sku },
          data: productData,
        });
        console.log(`  ↺  Updated  : ${raw.name}`);
        updated++;
      } else {
        product = await prisma.product.create({ data: productData });
        console.log(`  ✅ Created  : ${raw.name}`);
        created++;
      }

      // Seed reviews for newly created products only
      if (!existing && Array.isArray(raw.reviews) && raw.reviews.length > 0) {
        for (const rev of raw.reviews) {
          await prisma.review.create({
            data: {
              productId: product.id,
              rating: rev.rating ?? 5,
              comment: rev.comment ?? '',
              verified: rev.verified === true,
            },
          });
        }
        console.log(`     └─ Added ${raw.reviews.length} review(s)`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Error seeding "${raw.name}": ${message}`);
      errors++;
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  console.log('\n════════════════════════════════════════');
  console.log('  Seed Complete');
  console.log('════════════════════════════════════════');
  console.log(`  ✅ Created  : ${created}`);
  if (updated > 0) console.log(`  ↺  Updated  : ${updated}`);
  if (errors > 0) console.log(`  ❌ Errors   : ${errors}`);
  console.log(`  📦 Total    : ${created + updated}/${rawProducts.length}`);
  console.log('════════════════════════════════════════\n');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
