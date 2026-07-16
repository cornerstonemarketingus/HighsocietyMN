/*
  Scrape products from https://www.highsocietymn.com/shop

  Usage:
    DATABASE_URL=... npm run scrape:products
    tsx scripts/scrape-products.ts --dry-run
*/

import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import fs from "node:fs";
import path from "node:path";

type Category = {
  name: string;
  slug: string;
};

type ProductSeed = {
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
  categoryName: string;
};

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cleanText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseMoney(text: string | undefined | null): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parsePercentToNumber(text: string | undefined | null): number | null {
  if (!text) return null;
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function parseWeight(text: string | undefined | null): number | null {
  if (!text) return null;
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)\s*g\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

function discoverCategoryLinks(shopHtml: string, baseUrl: string): { category: Category; url: string }[] {
  const $ = cheerio.load(shopHtml);

  const keywords = [
    "Budz",
    "Pre Rolls",
    "Vape Carts",
    "Concentrates",
    "Edibles",
    "Deep Dizcountz",
    "Mystery Items",
  ];

  const candidates: { label: string; href: string }[] = [];

  $("a").each((_, a) => {
    const href = $(a).attr("href");
    const text = cleanText($(a).text() ?? "");
    if (!href || !text) return;

    const hit = keywords.find((k) => text.toLowerCase().includes(k.toLowerCase()));
    if (!hit) return;

    candidates.push({ label: hit, href });
  });

  const seen = new Set<string>();
  const out: { category: Category; url: string }[] = [];

  for (const c of candidates) {
    const abs = new URL(c.href, baseUrl).toString();
    if (seen.has(abs)) continue;
    seen.add(abs);

    out.push({
      category: { name: c.label, slug: normalizeSlug(c.label) },
      url: abs,
    });
  }

  return out;
}

function extractProductLinksFromCategory(html: string, baseUrl: string): { url: string }[] {
  const $ = cheerio.load(html);

  const links: string[] = [];

  $("a").each((_, a) => {
    const href = $(a).attr("href");
    if (!href) return;
    const abs = new URL(href, baseUrl).toString();

    // site heuristic
    if (!/\/product-page\//i.test(abs) && !/\/product\//i.test(abs) && !/\/p\//i.test(abs)) {
      return;
    }

    links.push(abs);
  });

  return Array.from(new Set(links)).map((url) => ({ url }));
}

function parseImages($: cheerio.CheerioAPI, root: cheerio.Cheerio<import("domhandler").AnyNode>): string[] {
  const urls: string[] = [];
  root.find("img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src") || $(img).attr("data-lazy-src");
    if (!src) return;
    urls.push(String(src));
  });

  // keep image-like URLs only
  const withExt = urls.filter((u) => /\.(jpg|jpeg|png|webp|gif)/i.test(u));

  // absolutize relative images where possible
  return uniq(
    withExt.map((u) => {
      try {
        return new URL(u, "https://www.highsocietymn.com").toString();
      } catch {
        return u;
      }
    })
  );
}

function extractProductFromDetailsPage(html: string, baseUrl: string): Omit<ProductSeed, "categoryName" | "featured" | "published" | "inStock" | "stockQuantity"> & { effects: string[]; flavors: string[]; terpenes: string[]; inStock: boolean; stockQuantity: number; } {
  const $ = cheerio.load(html);

  const canonical = $("link[rel='canonical']").attr("href");
  const currentUrl = canonical ? new URL(canonical, baseUrl).toString() : "";

  const h1 = cleanText($("h1").first().text() ?? "");
  const name = h1 || cleanText($("meta[property='og:title']").attr("content") ?? "");

  const slugFromUrl = currentUrl
    ? normalizeSlug(decodeURIComponent(currentUrl.split("/" ).filter(Boolean).pop() ?? name))
    : normalizeSlug(name);

  const description =
    cleanText($("meta[name='description']").attr("content") ?? "") || null;

  // brand (best-effort)
  let brand: string | null = null;
  const brandText = $("body").text();
  const brandMatch = brandText.match(/\bBrand\b\s*:?\s*([^\n\r]{1,80})/i);
  if (brandMatch) brand = cleanText(brandMatch[1]);

  // price (best-effort)
  const priceText =
    cleanText($("[data-price], [class*='price'], [id*='price']").first().text() ?? "") ||
    cleanText($("meta[property='product:price:amount']").attr("content") ?? "");
  const price = parseMoney(priceText) ?? 0;

  // compare price
  let comparePrice: number | null = null;
  const compareText =
    cleanText($("[class*='compare'], [class*='strike'], del").first().text() ?? "") ||
    cleanText($("meta[property='product:price:amount']").attr("content") ?? "");
  comparePrice = parseMoney(compareText);

  // images
  const gallery = $(".product-gallery, .gallery, main").first();
  const images = parseImages($, gallery.length ? gallery : $("body"));

  const bodyText = $("body").text();

  const attrs: Record<string, string> = {};
  $("table tr").each((_, tr) => {
    const key = cleanText($(tr).find("th, td").first().text() ?? "");
    const val = cleanText($(tr).find("td").last().text() ?? "");
    if (key) attrs[key] = val;
  });

  const thcText = attrs[Object.keys(attrs).find((k) => /thc/i.test(k)) ?? ""] ?? null;
  const cbdText = attrs[Object.keys(attrs).find((k) => /cbd/i.test(k)) ?? ""] ?? null;
  const weightText =
    attrs[Object.keys(attrs).find((k) => /weight|size|g\b/i.test(k)) ?? ""] ?? null;

  const thc = parsePercentToNumber(thcText || (bodyText.match(/THC\s*:?\s*([0-9]+(?:\.[0-9]+)?)\s*%/i) ?? [])[1] || null);
  const cbd = parsePercentToNumber(cbdText || (bodyText.match(/CBD\s*:?\s*([0-9]+(?:\.[0-9]+)?)\s*%/i) ?? [])[1] || null);

  const strain =
    attrs[Object.keys(attrs).find((k) => /strain/i.test(k)) ?? ""] ||
    (bodyText.match(/Strain\s*:?\s*([^\n\r]+?)(?:\n|$)/i) ?? [])[1] ||
    null;

  const weight = parseWeight(weightText);

  const effects: string[] = [];
  $(".effects, .product__effects").find("li, span").each((_, el) => {
    effects.push(cleanText($(el).text() ?? ""));
    return;
  });

  const flavors: string[] = [];
  $(".flavors, .product__flavors").find("li, span").each((_, el) => {
    flavors.push(cleanText($(el).text() ?? ""));
    return;
  });

  const terpenes: string[] = [];
  $(".terpenes, .product__terpenes").find("li, span").each((_, el) => {
    terpenes.push(cleanText($(el).text() ?? ""));
    return;
  });


  const inStock = !/out\s*of\s*stock|sold\s*out|oos/i.test(bodyText);
  const stockQuantity = inStock ? 0 : 0; // site parsing for quantity not reliably available

  return {
    name,
    slug: slugFromUrl || normalizeSlug(name || "product"),
    description,
    brand,
    sku: null,
    price,
    comparePrice,
    images,
    thcContent: thc,
    cbdContent: cbd,
    weight,
    strain: strain ? cleanText(String(strain)) : null,
    effects: uniq(effects),
    flavors: uniq(flavors),
    terpenes: uniq(terpenes),
    inStock,
    stockQuantity,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const concurrencyIdx = args.indexOf("--concurrency");
  const concurrency = concurrencyIdx !== -1 ? Number(args[concurrencyIdx + 1] ?? "4") : 4;

  const baseUrl = "https://www.highsocietymn.com";
  const shopUrl = `${baseUrl}/shop`;

  const cacheDir = path.join(process.cwd(), ".cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const prisma = dryRun ? null : createPrismaClient();

  if (!dryRun && !process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required (omit --dry-run to write into DB)");
  }

  console.log(`Fetching shop page: ${shopUrl}`);
  const shopHtml = await fetchHtml(shopUrl);
  const categoryLinks = discoverCategoryLinks(shopHtml, baseUrl);

  if (!categoryLinks.length) {
    console.warn("No category links discovered from shop page.");
    fs.writeFileSync(path.join(cacheDir, "shop.html"), shopHtml, "utf8");
    return;
  }

  console.log("Discovered categories:");
  for (const c of categoryLinks) console.log(`- ${c.category.name} => ${c.url}`);

  const queue: { url: string; category: Category }[] = [];

  for (const c of categoryLinks) {
    console.log(`Fetching category page: ${c.url}`);
    const html = await fetchHtml(c.url);
    fs.writeFileSync(path.join(cacheDir, `${c.category.slug}-category.html`), html, "utf8");

    const productLinks = extractProductLinksFromCategory(html, baseUrl);
    console.log(`  found ${productLinks.length} product links`);

    for (const p of productLinks) queue.push({ url: p.url, category: c.category });
  }

  const seen = new Set<string>();
  const deduped = queue.filter((q) => {
    if (seen.has(q.url)) return false;
    seen.add(q.url);
    return true;
  });

  console.log(`Total unique product URLs: ${deduped.length}`);

  const results: { product: ProductSeed; category: Category }[] = [];
  let idx = 0;

  const workers = Array.from({ length: concurrency }).map(async () => {
    while (true) {
      const myIdx = idx++;
      if (myIdx >= deduped.length) break;
      const job = deduped[myIdx];

      try {
        console.log(`[${myIdx + 1}/${deduped.length}] ${job.url}`);
        const html = await fetchHtml(job.url);
        const extracted = extractProductFromDetailsPage(html, baseUrl);

        const name = cleanText(String(extracted.name ?? ""));
        if (!name) {
          console.warn(`  skip: missing product name`);
          continue;
        }

        const price = Number(extracted.price ?? 0);
        if (!Number.isFinite(price) || price <= 0) {
          console.warn(`  skip: missing/invalid price for ${name}`);
          continue;
        }

        const product: ProductSeed = {
          name,
          slug: String(extracted.slug ?? normalizeSlug(name)),
          description: extracted.description ? String(extracted.description) : null,
          brand: extracted.brand ? String(extracted.brand) : null,
          sku: null,
          price,
          comparePrice: extracted.comparePrice != null ? Number(extracted.comparePrice) : null,
          images: (extracted.images ?? []).slice(0, 8),
          thcContent: extracted.thcContent ?? null,
          cbdContent: extracted.cbdContent ?? null,
          weight: extracted.weight ?? null,
          strain: extracted.strain ?? null,
          effects: extracted.effects ?? [],
          flavors: extracted.flavors ?? [],
          terpenes: extracted.terpenes ?? [],
          inStock: Boolean(extracted.inStock),
          stockQuantity: extracted.stockQuantity ?? 0,
          featured: false,
          published: true,
          categoryName: job.category.name,
        };

        results.push({ product, category: job.category });
      } catch (e) {
        console.error(`  error scraping ${job.url}`, e);
      }
    }
  });

  await Promise.all(workers);

  console.log(`Scraped ${results.length} products. ${dryRun ? "(dry-run)" : "Writing to DB..."}`);

  if (dryRun) {
    const outPath = path.join(cacheDir, `scrape-products-dryrun.json`);
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
    console.log(`Dry-run results written: ${outPath}`);
    return;
  }

  if (!prisma) throw new Error("prisma is null while writing to DB");

  const categoryBySlug = new Map<string, string>();

  for (const r of results) {
    const cat = r.category;

    let catId = categoryBySlug.get(cat.slug);
    if (!catId) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, slug: cat.slug },
        create: { name: cat.name, slug: cat.slug, sortOrder: 0 },
      });
      catId = created.id;
      categoryBySlug.set(cat.slug, catId);
    }

    await prisma.product.upsert({
      where: { slug: r.product.slug },
      update: {
        name: r.product.name,
        description: r.product.description ?? null,
        categoryId: catId,
        brand: r.product.brand ?? null,
        sku: r.product.sku ?? null,
        price: r.product.price,
        comparePrice: r.product.comparePrice ?? null,
        images: r.product.images,
        thcContent: r.product.thcContent ?? null,
        cbdContent: r.product.cbdContent ?? null,
        weight: r.product.weight ?? null,
        strain: r.product.strain ?? null,
        effects: r.product.effects ?? [],
        flavors: r.product.flavors ?? [],
        terpenes: r.product.terpenes ?? [],
        inStock: r.product.inStock,
        stockQuantity: r.product.stockQuantity ?? 0,
        featured: r.product.featured,
        published: r.product.published,
      },
      create: {
        name: r.product.name,
        slug: r.product.slug,
        description: r.product.description ?? null,
        categoryId: catId,
        brand: r.product.brand ?? null,
        sku: r.product.sku ?? null,
        price: r.product.price,
        comparePrice: r.product.comparePrice ?? null,
        images: r.product.images,
        thcContent: r.product.thcContent ?? null,
        cbdContent: r.product.cbdContent ?? null,
        weight: r.product.weight ?? null,
        strain: r.product.strain ?? null,
        effects: r.product.effects ?? [],
        flavors: r.product.flavors ?? [],
        terpenes: r.product.terpenes ?? [],
        inStock: r.product.inStock,
        stockQuantity: r.product.stockQuantity ?? 0,
        featured: r.product.featured,
        published: r.product.published,
      },
    });
  }

  await prisma.$disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

