import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

type CatalogRow = {
  product: {
    name: string;
    slug: string;
    description?: string | null;
    brand?: string | null;
    sku?: string | null;
    price: number;
    comparePrice?: number | null;
    images: string[];
    thcContent?: number | null;
    cbdContent?: number | null;
    weight?: number | null;
    strain?: string | null;
    effects: string[];
    flavors: string[];
    terpenes: string[];
    inStock: boolean;
    stockQuantity: number;
    featured: boolean;
    published: boolean;
  };
  category: { name: string; slug: string };
};

const snapshotPath = path.resolve(".cache", "scrape-products-dryrun.json");
const maxSnapshotAgeMs = 30 * 60 * 1000;

async function main() {
  if (!process.argv.includes("--confirm")) {
    throw new Error("Refusing to write without --confirm");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  if (!fs.existsSync(snapshotPath)) {
    throw new Error("Validated catalog snapshot is missing; run npm run scrape:products -- --dry-run first");
  }

  const snapshotAge = Date.now() - fs.statSync(snapshotPath).mtimeMs;
  if (snapshotAge > maxSnapshotAgeMs) {
    throw new Error("Catalog snapshot is stale; run a fresh dry-run before writing");
  }

  const rows = JSON.parse(fs.readFileSync(snapshotPath, "utf8")) as CatalogRow[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Catalog snapshot contains no products");
  }
  const slugs = rows.map(({ product }) => product.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Catalog snapshot contains duplicate product slugs");
  }

  const sql = neon(process.env.DATABASE_URL);
  const categoryIds = new Map<string, string>();

  for (const { category } of rows) {
    if (categoryIds.has(category.slug)) continue;
    const id = randomUUID();
    const result = await sql`
      INSERT INTO categories (id, name, slug, "sortOrder", "createdAt", "updatedAt")
      VALUES (${id}, ${category.name}, ${category.slug}, 0, NOW(), NOW())
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, "updatedAt" = NOW()
      RETURNING id
    `;
    categoryIds.set(category.slug, String(result[0].id));
  }

  for (const { product, category } of rows) {
    const categoryId = categoryIds.get(category.slug);
    if (!categoryId) throw new Error(`Missing category id for ${category.slug}`);
    const id = randomUUID();
    await sql`
      INSERT INTO products (
        id, name, slug, description, "categoryId", brand, sku, price, "comparePrice",
        images, "thcContent", "cbdContent", weight, strain, effects, flavors, terpenes,
        "inStock", "stockQuantity", featured, published, "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${product.name}, ${product.slug}, ${product.description ?? null}, ${categoryId},
        ${product.brand ?? null}, ${product.sku ?? null}, ${product.price}, ${product.comparePrice ?? null},
        ${product.images}, ${product.thcContent ?? null}, ${product.cbdContent ?? null},
        ${product.weight ?? null}, ${product.strain ?? null}, ${product.effects}, ${product.flavors},
        ${product.terpenes}, ${product.inStock}, ${product.stockQuantity ?? 0}, ${product.featured},
        ${product.published}, NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        "categoryId" = EXCLUDED."categoryId",
        brand = EXCLUDED.brand,
        sku = EXCLUDED.sku,
        price = EXCLUDED.price,
        "comparePrice" = EXCLUDED."comparePrice",
        images = EXCLUDED.images,
        "thcContent" = EXCLUDED."thcContent",
        "cbdContent" = EXCLUDED."cbdContent",
        weight = EXCLUDED.weight,
        strain = EXCLUDED.strain,
        effects = EXCLUDED.effects,
        flavors = EXCLUDED.flavors,
        terpenes = EXCLUDED.terpenes,
        "inStock" = EXCLUDED."inStock",
        "stockQuantity" = EXCLUDED."stockQuantity",
        featured = EXCLUDED.featured,
        published = EXCLUDED.published,
        "updatedAt" = NOW()
    `;
  }

  const unpublished = await sql`
    UPDATE products
    SET published = FALSE, "inStock" = FALSE, "updatedAt" = NOW()
    WHERE published = TRUE AND NOT (slug = ANY(${slugs}))
    RETURNING slug
  `;
  console.log(`Neon HTTPS catalog sync complete: ${rows.length} products, ${unpublished.length} unpublished.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
