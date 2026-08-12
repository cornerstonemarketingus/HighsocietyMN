import { load as cheerioLoad } from "cheerio";

export const SOURCE_BASE_URL = "https://www.highsocietymn.com";

export interface ScrapedProduct {
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
}

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

export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; HighSocietyMN-sync/1.0; owner-approved)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${url}`);
  return response.text();
}

export async function discoverProductUrls(html: string): Promise<string[]> {
  const $ = cheerioLoad(html);
  const urls = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (
      href.match(/\/(product|shop|menu|item|cannabis|flower|edible|vape|concentrate)s?\//i) ||
      href.match(/\/p\/[^/]+/) ||
      href.match(/product[_-]?id=/i)
    ) {
      const abs = href.startsWith("http") ? href : `${SOURCE_BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
      urls.add(abs);
    }
  });

  return Array.from(urls);
}

export async function findShopPages(): Promise<string[]> {
  const pages: string[] = [];
  const candidates = ["/shop", "/menu", "/products", "/cannabis", "/store", "/order", "/dispensary"];

  for (const path of candidates) {
    try {
      const html = await fetchHtml(`${SOURCE_BASE_URL}${path}`);
      if (html.length > 500 && !html.includes("404")) pages.push(`${SOURCE_BASE_URL}${path}`);
    } catch {
      // not found, continue
    }
  }

  return pages;
}

const EFFECT_WORDS = ["Relaxed", "Happy", "Euphoric", "Uplifted", "Energetic", "Creative", "Focused", "Sleepy", "Calm", "Giggly", "Talkative", "Tingly", "Aroused", "Hungry"];
const FLAVOR_WORDS = ["Berry", "Sweet", "Citrus", "Lemon", "Orange", "Mango", "Tropical", "Pine", "Earthy", "Woody", "Mint", "Chocolate", "Vanilla", "Floral", "Fruity", "Spicy", "Diesel", "Skunky", "Grape", "Blueberry", "Strawberry", "Watermelon", "Peach", "Herbal"];

export function parseProductPage(html: string, url: string): ScrapedProduct | null {
  const $ = cheerioLoad(html);

  const name =
    $("h1.product-title, h1.product_title, h1[itemprop='name'], .product-name h1, h1").first().text().trim() ||
    $("title").text().replace(/ [-–|].*$/, "").trim();
  if (!name) return null;

  const priceText = $(".price .amount, .woocommerce-Price-amount, [itemprop='price'], .product-price, .price").first().text().trim();
  const price = parsePrice(priceText) ?? 0;

  const comparePriceText = $(".price del .amount, .regular-price").first().text().trim();
  const comparePrice = comparePriceText ? parsePrice(comparePriceText) : null;

  const categoryRaw =
    $(".product_meta .posted_in a, .product-category, nav.woocommerce-breadcrumb a").last().text().trim() ||
    url.split("/").slice(-3, -2)[0] ||
    "accessories";
  const categorySlug = mapCategory(categoryRaw);

  const brand = $(".product_meta .brand a, [itemprop='brand'], .product-brand").first().text().trim() || null;

  const description =
    $(".woocommerce-product-details__short-description, .product-description, #tab-description, [itemprop='description']")
      .first().text().replace(/\s+/g, " ").trim().substring(0, 1000) || null;

  const images: string[] = [];
  $("img.wp-post-image, .woocommerce-product-gallery img, .product-image img, [itemprop='image']").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("data-large_image") || $(el).attr("src") || "";
    if (src && !src.includes("placeholder") && src.startsWith("http")) images.push(src);
  });

  const fullText = $("body").text();
  const thcMatch = fullText.match(/THC[:\s]*([0-9.]+)\s*%/i);
  const cbdMatch = fullText.match(/CBD[:\s]*([0-9.]+)\s*%/i);
  const thcContent = thcMatch ? parseFloat(thcMatch[1]) : null;
  const cbdContent = cbdMatch ? parseFloat(cbdMatch[1]) : null;

  let strain: string | null = null;
  const strainMatch = fullText.match(/\b(sativa|indica|hybrid)\b/i);
  if (strainMatch) strain = strainMatch[1].toLowerCase();

  const weightMatch = fullText.match(/([0-9.]+)\s*g(?:ram)?s?\b/i);
  const weight = weightMatch ? parseFloat(weightMatch[1]) : null;

  const effects = EFFECT_WORDS.filter((e) => new RegExp(`\\b${e}\\b`, "i").test(fullText));
  const flavors = FLAVOR_WORDS.filter((f) => new RegExp(`\\b${f}\\b`, "i").test(fullText));

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
  };
}

export async function scrapeAllProducts(): Promise<ScrapedProduct[]> {
  const homepageHtml = await fetchHtml(SOURCE_BASE_URL);

  const shopPages = await findShopPages();
  if (!shopPages.length) shopPages.push(SOURCE_BASE_URL);

  const productUrls = new Set<string>();
  for (const page of shopPages) {
    const html = page === SOURCE_BASE_URL ? homepageHtml : await fetchHtml(page);
    (await discoverProductUrls(html)).forEach((u) => productUrls.add(u));
  }
  (await discoverProductUrls(homepageHtml)).forEach((u) => productUrls.add(u));

  const products: ScrapedProduct[] = [];
  const slugsSeen = new Set<string>();

  for (const url of productUrls) {
    try {
      const html = await fetchHtml(url);
      const product = parseProductPage(html, url);
      if (product && product.name && product.price > 0) {
        let slug = product.slug;
        let i = 2;
        while (slugsSeen.has(slug)) slug = `${product.slug}-${i++}`;
        product.slug = slug;
        slugsSeen.add(slug);
        products.push(product);
      }
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.warn(`Error scraping ${url}:`, (err as Error).message);
    }
  }

  return products;
}
