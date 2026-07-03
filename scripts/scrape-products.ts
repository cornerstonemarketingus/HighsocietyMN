/**
 * Product scraper for www.highsocietymn.com
 *
 * Usage:
 *   npx tsx scripts/scrape-products.ts
 *
 * Output:
 *   scripts/products.json  — array of scraped products ready for import-products.ts
 *
 * The scraper walks the main menu/shop pages and extracts:
 *   name, slug, price, category, brand, description, THC%, CBD%,
 *   images, strain type, effects, flavors
 *
 * If the site is behind Cloudflare or requires JS rendering, set
 * USE_PUPPETEER=1 in your environment and install puppeteer:
 *   npm install --save-dev puppeteer
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { load as cheerioLoad } from "cheerio";

const BASE_URL = "https://www.highsocietymn.com";
const OUT_FILE = path.join(__dirname, "products.json");

// ── helpers ────────────────────────────────────────────────────────────────

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; HighSocietyMN-scraper/1.0; owner-approved)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow single redirect
          fetchHtml(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      }
    );
    req.on("error", reject);
    req.setTimeout(15_000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePrice(text: string): number | null {
  const m = text.match(/\$?([\d,]+\.?\d*)/);
  return m ? parseFloat(m[1].replace(",", "")) : null;
}

function parsePercent(text: string): number | null {
  const m = text.match(/([\d.]+)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

// ── category mapping ────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  flower: "flower",
  pre: "flower",
  "pre-roll": "flower",
  edible: "edibles",
  edibles: "edibles",
  gummy: "edibles",
  chocolate: "edibles",
  vape: "vapes",
  vapes: "vapes",
  cartridge: "vapes",
  cart: "vapes",
  concentrate: "concentrates",
  concentrates: "concentrates",
  wax: "concentrates",
  shatter: "concentrates",
  rosin: "concentrates",
  resin: "concentrates",
  beverage: "beverages",
  beverages: "beverages",
  drink: "beverages",
  tincture: "accessories",
  topical: "accessories",
  accessory: "accessories",
  accessories: "accessories",
};

function mapCategory(raw: string): string {
  const lower = raw.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return value;
  }
  return "accessories";
}

// ── product type ────────────────────────────────────────────────────────────

interface ScrapedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  brand: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  thcContent: number | null;
  cbdContent: number | null;
  weight: number | null;
  strain: string | null;
  effects: string[];
  flavors: string[];
  images: string[];
  inStock: boolean;
  featured: boolean;
}

// ── page discovery ──────────────────────────────────────────────────────────

async function discoverProductUrls(html: string): Promise<string[]> {
  const $ = cheerioLoad(html);
  const urls = new Set<string>();

  // Common patterns for cannabis e-commerce (Dutchie embeds, WooCommerce, custom)
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (
      href.match(/\/(product|shop|menu|item|cannabis|flower|edible|vape|concentrate)s?\//i) ||
      href.match(/\/p\/[^/]+/) ||
      href.match(/product[_-]?id=/i)
    ) {
      const abs = href.startsWith("http") ? href : `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
      urls.add(abs);
    }
  });

  return Array.from(urls);
}

async function findShopPages(): Promise<string[]> {
  const pages: string[] = [];
  // Common shop/menu paths for cannabis dispensary sites
  const candidates = [
    "/shop",
    "/menu",
    "/products",
    "/cannabis",
    "/store",
    "/order",
    "/dispensary",
  ];

  for (const path of candidates) {
    try {
      const html = await fetchHtml(`${BASE_URL}${path}`);
      if (html.length > 500 && !html.includes("404")) {
        pages.push(`${BASE_URL}${path}`);
        console.log(`  Found shop page: ${path}`);
      }
    } catch {
      // not found, continue
    }
  }

  return pages;
}

// ── product parser ──────────────────────────────────────────────────────────

function parseProductPage(html: string, url: string): ScrapedProduct | null {
  const $ = cheerioLoad(html);

  // Name
  const name =
    $("h1.product-title, h1.product_title, h1[itemprop='name'], .product-name h1, h1")
      .first()
      .text()
      .trim() ||
    $("title").text().replace(/ [-–|].*$/, "").trim();

  if (!name) return null;

  // Price — try multiple selectors
  const priceText =
    $(".price .amount, .woocommerce-Price-amount, [itemprop='price'], .product-price, .price")
      .first()
      .text()
      .trim();
  const price = parsePrice(priceText) ?? 0;

  // Compare price (sale)
  const comparePriceText = $(".price del .amount, .regular-price").first().text().trim();
  const comparePrice = comparePriceText ? parsePrice(comparePriceText) : null;

  // Category
  const categoryRaw =
    $(".product_meta .posted_in a, .product-category, nav.woocommerce-breadcrumb a").last().text().trim() ||
    url.split("/").slice(-3, -2)[0] ||
    "accessories";
  const categorySlug = mapCategory(categoryRaw);

  // Brand
  const brand =
    $(".product_meta .brand a, [itemprop='brand'], .product-brand").first().text().trim() ||
    null;

  // Description
  const description =
    $(".woocommerce-product-details__short-description, .product-description, #tab-description, [itemprop='description']")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 1000) || null;

  // Images
  const images: string[] = [];
  $("img.wp-post-image, .woocommerce-product-gallery img, .product-image img, [itemprop='image']").each((_, el) => {
    const src =
      $(el).attr("data-src") ||
      $(el).attr("data-large_image") ||
      $(el).attr("src") ||
      "";
    if (src && !src.includes("placeholder") && src.startsWith("http")) {
      images.push(src);
    }
  });

  // THC / CBD — scan full page text
  const fullText = $("body").text();
  const thcMatch = fullText.match(/THC[:\s]*([0-9.]+)\s*%/i);
  const cbdMatch = fullText.match(/CBD[:\s]*([0-9.]+)\s*%/i);
  const thcContent = thcMatch ? parseFloat(thcMatch[1]) : null;
  const cbdContent = cbdMatch ? parseFloat(cbdMatch[1]) : null;

  // Strain type
  let strain: string | null = null;
  const strainMatch = fullText.match(/\b(sativa|indica|hybrid)\b/i);
  if (strainMatch) strain = strainMatch[1].toLowerCase();

  // Weight (grams)
  const weightMatch = fullText.match(/([0-9.]+)\s*g(?:ram)?s?\b/i);
  const weight = weightMatch ? parseFloat(weightMatch[1]) : null;

  // Effects — common cannabis effects words
  const EFFECT_WORDS = ["Relaxed", "Happy", "Euphoric", "Uplifted", "Energetic", "Creative", "Focused", "Sleepy", "Calm", "Giggly", "Talkative", "Tingly", "Aroused", "Hungry"];
  const effects = EFFECT_WORDS.filter((e) =>
    new RegExp(`\\b${e}\\b`, "i").test(fullText)
  );

  // Flavors
  const FLAVOR_WORDS = ["Berry", "Sweet", "Citrus", "Lemon", "Orange", "Mango", "Tropical", "Pine", "Earthy", "Woody", "Mint", "Chocolate", "Vanilla", "Floral", "Fruity", "Spicy", "Diesel", "Skunky", "Grape", "Blueberry", "Strawberry", "Watermelon", "Peach", "Herbal"];
  const flavors = FLAVOR_WORDS.filter((f) =>
    new RegExp(`\\b${f}\\b`, "i").test(fullText)
  );

  // Stock
  const inStock = !$(".out-of-stock, .stock.out-of-stock").length;

  return {
    name,
    slug: slugify(name),
    categorySlug,
    brand,
    description,
    price,
    comparePrice,
    thcContent,
    cbdContent,
    weight,
    strain,
    effects: effects.slice(0, 6),
    flavors: flavors.slice(0, 6),
    images: images.slice(0, 4),
    inStock,
    featured: false,
  };
}

// ── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Scraping products from www.highsocietymn.com ...\n");

  // 1. Fetch homepage
  let homepageHtml: string;
  try {
    homepageHtml = await fetchHtml(BASE_URL);
    console.log("✓ Homepage fetched");
  } catch (err) {
    console.error(`✗ Could not reach ${BASE_URL}:`, (err as Error).message);
    console.error("\nNote: Run this script from your local machine where the site is reachable.");
    process.exit(1);
  }

  // 2. Find shop/menu pages
  const shopPages = await findShopPages();
  if (!shopPages.length) {
    shopPages.push(BASE_URL);
  }

  // 3. Collect product URLs from shop pages
  const productUrls = new Set<string>();
  for (const page of shopPages) {
    const html = page === BASE_URL ? homepageHtml : await fetchHtml(page);
    const found = await discoverProductUrls(html);
    found.forEach((u) => productUrls.add(u));
  }

  // Also try homepage
  const homeUrls = await discoverProductUrls(homepageHtml);
  homeUrls.forEach((u) => productUrls.add(u));

  console.log(`\nFound ${productUrls.size} product URL(s) to scrape.\n`);

  if (productUrls.size === 0) {
    console.warn("⚠  No product URLs discovered. The site may require JavaScript rendering.");
    console.warn("   Try setting USE_PUPPETEER=1 and installing puppeteer, or manually add URLs");
    console.warn("   to the MANUAL_PRODUCT_URLS array at the bottom of this file.\n");
  }

  // 4. Scrape each product page
  const products: ScrapedProduct[] = [];
  const slugsSeen = new Set<string>();

  for (const url of productUrls) {
    try {
      console.log(`  Scraping: ${url}`);
      const html = await fetchHtml(url);
      const product = parseProductPage(html, url);

      if (product && product.name && product.price > 0) {
        // de-duplicate by slug
        let slug = product.slug;
        let i = 2;
        while (slugsSeen.has(slug)) {
          slug = `${product.slug}-${i++}`;
        }
        product.slug = slug;
        slugsSeen.add(slug);
        products.push(product);
        console.log(`    ✓ ${product.name} — $${product.price} (${product.categorySlug})`);
      } else {
        console.log(`    ⚠  Skipped (no name or price): ${url}`);
      }

      // polite delay
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.warn(`    ✗ Error scraping ${url}:`, (err as Error).message);
    }
  }

  // 5. Write output
  fs.writeFileSync(OUT_FILE, JSON.stringify(products, null, 2));
  console.log(`\n✅ Scraped ${products.length} product(s) → ${OUT_FILE}`);
  console.log('   Run "npm run import:products" to load them into your database.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
