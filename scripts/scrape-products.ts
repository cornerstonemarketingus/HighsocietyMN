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
import { pathToFileURL } from "node:url";

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

export type CatalogDiagnostic = {
  sitemapCount: number;
  scrapedCount: number;
  categoryOnlyCount: number;
  missingUrls: string[];
  duplicateSlugs: string[];
  productsWithoutImages: string[];
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

export function cleanText(s: string) {
  const decoded = cheerio.load(`<span>${s}</span>`)("span").text();
  return decoded.replace(/\s+/g, " ").trim();
}

export function parseMoney(text: string | undefined | null): number | null {
  if (!text) return null;
  const match = text.replace(/,/g, "").match(/(?:\$|USD\s*)?([0-9]+(?:\.[0-9]{1,2})?)/i);
  const n = match ? Number(match[1]) : NaN;
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

function labeledValues(text: string, label: string): string[] {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`(?:^|[\\n|])\\s*${escaped}\\s*[:\\-]\\s*([^\\n|]+)`, "i"));
  return match ? match[1].split(/[,;/]/).map(cleanText).filter(Boolean) : [];
}

async function fetchHtml(url: string, attempts = 3) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

function normalizeCategory(category: Category): Category {
  const aliases: Record<string, Category> = {
    budz: { name: "Flower", slug: "flower" },
    "pre-rolls": { name: "Pre-Rolls", slug: "pre-rolls" },
    "vape-carts": { name: "Vapes", slug: "vapes" },
    "deep-dizcountz": { name: "Specials", slug: "specials" },
    "mystery-items": { name: "Mystery", slug: "mystery" },
  };
  return aliases[category.slug] ?? category;
}

export function extractSitemapProductLinks(xml: string, baseUrl: string) {
  const $ = cheerio.load(xml, { xmlMode: true });
  return uniq($("loc").map((_, node) => cleanText($(node).text())).get())
    .filter(url => /\/product-page\//i.test(url))
    .map(url => new URL(url, baseUrl).toString());
}

export function normalizeProductUrl(url: string, baseUrl: string) {
  const parsed = new URL(url, baseUrl);
  parsed.hash = "";
  parsed.search = "";
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  return parsed.toString();
}

export function normalizeWixImage(value: unknown): string | null {
  let candidate: unknown = value;
  if (candidate && typeof candidate === "object") {
    const record = candidate as Record<string, unknown>;
    candidate = record.url ?? record.contentUrl ?? record.src;
  }
  if (typeof candidate !== "string" || !candidate || candidate === "[object Object]") return null;
  try {
    const url = new URL(candidate, "https://www.highsocietymn.com");
    if (url.hostname === "static.wixstatic.com") {
      const media = url.pathname.match(/^(\/media\/[^/]+\.(?:jpe?g|png|webp|gif))/i)?.[1];
      if (media) url.pathname = media;
      url.search = "";
    }
    return /\.(?:jpe?g|png|webp|gif)(?:$|\?)/i.test(url.toString()) ? url.toString() : null;
  } catch {
    return null;
  }
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
    if (/\/product-page\//i.test(abs)) continue;
    if (seen.has(abs)) continue;
    seen.add(abs);

    out.push({
      category: normalizeCategory({ name: c.label, slug: normalizeSlug(c.label) }),
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

export function parseImages($: cheerio.CheerioAPI, root: cheerio.Cheerio<import("domhandler").AnyNode>): string[] {
  const urls: string[] = [];
  root.find("img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src") || $(img).attr("data-lazy-src");
    if (!src) return;
    urls.push(String(src));
  });

  return uniq(urls.map(normalizeWixImage).filter((url): url is string => Boolean(url)));
}

export function extractProductFromDetailsPage(html: string, baseUrl: string): Omit<ProductSeed, "categoryName" | "featured" | "published" | "inStock" | "stockQuantity"> & { effects: string[]; flavors: string[]; terpenes: string[]; inStock: boolean; stockQuantity: number; } {
  const $ = cheerio.load(html);

  let structuredProduct: Record<string, unknown> | null = null;
  $("script[type='application/ld+json']").each((_, script) => {
    try {
      const parsed = JSON.parse($(script).text()) as unknown;
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      const queue = [...candidates];
      while (queue.length) {
        const value = queue.shift();
        if (!value || typeof value !== "object") continue;
        const record = value as Record<string, unknown>;
        if (record["@type"] === "Product") { structuredProduct = record; return false; }
        if (Array.isArray(record["@graph"])) queue.push(...record["@graph"]);
      }
    } catch { /* Invalid third-party JSON-LD is ignored. */ }
  });

  const canonical = $("link[rel='canonical']").attr("href");
  const currentUrl = canonical ? new URL(canonical, baseUrl).toString() : "";

  const h1 = cleanText($("h1").first().text() ?? "");
  const name = h1 || cleanText($("meta[property='og:title']").attr("content") ?? "");

  const slugFromUrl = currentUrl
    ? normalizeSlug(decodeURIComponent(currentUrl.split("/" ).filter(Boolean).pop() ?? name))
    : normalizeSlug(name);
  const productData = structuredProduct as Record<string, unknown> | null;

  const description = cleanText(String(productData?.description ?? $("meta[property='og:description']").attr("content") ?? $("meta[name='description']").attr("content") ?? "")) || null;

  // brand (best-effort)
  const structuredBrand = productData?.brand;
  const rawBrand = typeof structuredBrand === "string" ? cleanText(structuredBrand) :
    structuredBrand && typeof structuredBrand === "object" && "name" in structuredBrand ? cleanText(String((structuredBrand as { name: unknown }).name)) : null;
  const brand = rawBrand && !/^(high society(?: mn)?|website|store)$/i.test(rawBrand) ? rawBrand : null;

  // price (best-effort)
  const offers = productData?.offers && typeof productData.offers === "object" ? productData.offers as Record<string, unknown> : null;
  const fallbackPrice = cleanText($("[data-price], [class*='price'], [id*='price']").first().text() ?? "") || cleanText($("meta[property='product:price:amount']").attr("content") ?? "");
  const priceText = String(offers?.price ?? fallbackPrice);
  const price = parseMoney(priceText) ?? 0;

  // compare price
  const compareText = cleanText($("[class*='compare'], [class*='strike'], del").first().text() ?? "");
  const parsedComparePrice = parseMoney(compareText);
  const comparePrice = parsedComparePrice && parsedComparePrice > price ? parsedComparePrice : null;

  // images
  const gallery = $(".product-gallery, .gallery, main").first();
  const structuredImages = Array.isArray(productData?.image) ? productData.image : productData?.image ? [productData.image] : [];
  const images = uniq([...structuredImages, ...parseImages($, gallery.length ? gallery : $("body"))]
    .map(normalizeWixImage).filter((url): url is string => Boolean(url)));

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

  const labeledBlocks = $("main p, main li, main tr").map((_, element) => cleanText($(element).text())).get();
  const explicitText = (labeledBlocks.length ? labeledBlocks.join("\n") : $("main").text()).replace(/\r/g, "");
  const strain = attrs[Object.keys(attrs).find((k) => /^(strain|type)$/i.test(cleanText(k))) ?? ""]
    || labeledValues(explicitText, "Strain")[0] || null;

  const weight = parseWeight(weightText);

  const effects: string[] = [];
  $(".effects, .product__effects").find("li, span").each((_, el) => {
    effects.push(cleanText($(el).text() ?? ""));
    return;
  });
  effects.push(...labeledValues(explicitText, "Effects"));

  const flavors: string[] = [];
  $(".flavors, .product__flavors").find("li, span").each((_, el) => {
    flavors.push(cleanText($(el).text() ?? ""));
    return;
  });
  flavors.push(...labeledValues(explicitText, "Flavors"), ...labeledValues(explicitText, "Flavor"));

  const terpenes: string[] = [];
  $(".terpenes, .product__terpenes").find("li, span").each((_, el) => {
    terpenes.push(cleanText($(el).text() ?? ""));
    return;
  });
  terpenes.push(...labeledValues(explicitText, "Terpenes"), ...labeledValues(explicitText, "Terpene"));


  const availability = String(offers?.availability ?? "");
  const inStock = availability ? /InStock$/i.test(availability) : !/out\s*of\s*stock|sold\s*out/i.test($("main").text());
  const stockQuantity = inStock ? 1 : 0;

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

export function catalogDiagnostics(
  sitemapUrls: string[],
  results: { sourceUrl: string; product: Pick<ProductSeed, "slug" | "images"> }[],
  baseUrl: string,
): CatalogDiagnostic {
  const sitemap = new Set(sitemapUrls.map(url => normalizeProductUrl(url, baseUrl)));
  const scraped = new Set(results.map(result => normalizeProductUrl(result.sourceUrl, baseUrl)));
  const slugs = new Map<string, number>();
  for (const { product } of results) slugs.set(product.slug, (slugs.get(product.slug) ?? 0) + 1);
  return {
    sitemapCount: sitemap.size,
    scrapedCount: results.length,
    categoryOnlyCount: [...scraped].filter(url => !sitemap.has(url)).length,
    missingUrls: [...sitemap].filter(url => !scraped.has(url)),
    duplicateSlugs: [...slugs].filter(([, count]) => count > 1).map(([slug]) => slug),
    productsWithoutImages: results.filter(({ product }) => product.images.length === 0).map(({ product }) => product.slug),
  };
}

export function manifestChanges(firstUrls: string[], secondUrls: string[], baseUrl: string) {
  const first = new Set(firstUrls.map(url => normalizeProductUrl(url, baseUrl)));
  const second = new Set(secondUrls.map(url => normalizeProductUrl(url, baseUrl)));
  return {
    added: [...second].filter(url => !first.has(url)),
    removed: [...first].filter(url => !second.has(url)),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const concurrencyIdx = args.indexOf("--concurrency");
  const concurrency = concurrencyIdx !== -1 ? Number(args[concurrencyIdx + 1] ?? "4") : 4;

  const baseUrl = "https://www.highsocietymn.com";
  const shopUrl = `${baseUrl}/shop`;
  const sitemapUrl = `${baseUrl}/store-products-sitemap.xml`;

  const cacheDir = path.join(process.cwd(), ".cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const prisma = dryRun ? null : createPrismaClient();

  if (!dryRun && !process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required (omit --dry-run to write into DB)");
  }

  console.log(`Fetching shop page: ${shopUrl}`);
  const shopHtml = await fetchHtml(shopUrl);
  const categoryLinks = discoverCategoryLinks(shopHtml, baseUrl);
  const sitemapProductLinks = extractSitemapProductLinks(await fetchHtml(sitemapUrl), baseUrl);
  console.log(`Sitemap coverage baseline: ${sitemapProductLinks.length} products`);

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

  const queuedUrls = new Set(queue.map(item => item.url));
  for (const url of sitemapProductLinks) {
    if (!queuedUrls.has(url)) queue.push({ url, category: { name: "Other", slug: "other" } });
  }

  const seen = new Set<string>();
  const deduped = queue.filter((q) => {
    if (seen.has(q.url)) return false;
    seen.add(q.url);
    return true;
  });

  console.log(`Total unique product URLs: ${deduped.length}`);

  const results: { sourceUrl: string; product: ProductSeed; category: Category }[] = [];
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

        results.push({ sourceUrl: job.url, product, category: job.category });
      } catch (e) {
        console.error(`  error scraping ${job.url}`, e);
      }
    }
  });

  await Promise.all(workers);

  // Wix can briefly serve category pages from different cache generations. Re-read
  // the complete manifest before reconciling so transient removals never unpublish stock.
  const confirmationUrls = extractSitemapProductLinks(await fetchHtml(sitemapUrl), baseUrl);
  for (const category of categoryLinks) {
    const html = await fetchHtml(category.url);
    confirmationUrls.push(...extractProductLinksFromCategory(html, baseUrl).map(link => link.url));
  }
  const changes = manifestChanges(deduped.map(item => item.url), confirmationUrls, baseUrl);
  if (changes.added.length || changes.removed.length) {
    console.error(`Catalog source changed during crawl: ${JSON.stringify(changes)}`);
    throw new Error("Catalog source was unstable during crawl; no database changes were made");
  }

  const diagnostics = catalogDiagnostics(sitemapProductLinks, results, baseUrl);
  console.log(`Catalog diagnostics: ${JSON.stringify(diagnostics)}`);
  if (diagnostics.missingUrls.length || diagnostics.duplicateSlugs.length) {
    throw new Error(`Catalog completeness check failed: ${diagnostics.missingUrls.length} missing URL(s), ${diagnostics.duplicateSlugs.length} duplicate slug(s)`);
  }

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

  const liveSlugs = results.map(result => result.product.slug);
  const reconciled = await prisma.product.updateMany({
    where: { slug: { notIn: liveSlugs }, published: true },
    data: { published: false, inStock: false },
  });
  console.log(`Reconciled catalog: unpublished ${reconciled.count} product(s) absent from the live sitemap.`);

  await prisma.$disconnect();
  console.log("Done.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

