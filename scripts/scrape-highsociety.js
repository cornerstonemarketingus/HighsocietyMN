#!/usr/bin/env node
/**
 * scripts/scrape-highsociety.js
 *
 * Scrapes product data from https://www.highsocietymn.com/shop
 * and saves results to data/products.json.
 *
 * Usage:
 *   node scripts/scrape-highsociety.js
 *   node scripts/scrape-highsociety.js --headless false   (show browser)
 *   node scripts/scrape-highsociety.js --output ./data/products.json
 *
 * Dependencies:
 *   npm install puppeteer cheerio axios
 */

'use strict';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ─── CLI Arguments ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (name, defaultVal) => {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
};

const HEADLESS = getArg('--headless', 'true') !== 'false';
const OUTPUT_FILE = getArg('--output', path.join(__dirname, '..', 'data', 'products.json'));
const BASE_URL = 'https://www.highsocietymn.com';
const BASE_HOSTNAME = 'www.highsocietymn.com';
const SHOP_URL = `${BASE_URL}/shop`;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a URL-friendly slug from a product name.
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate a SKU from a product name and category.
 */
function generateSku(name, category) {
  const base = slugify(name).substring(0, 30);
  const catCode = (category || 'misc').toLowerCase().replace(/_/g, '-');
  return `${catCode}-${base}-001`.replace(/--+/g, '-');
}

/**
 * Parse a price string like "$45.00" → 45.00
 */
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extract a float percentage from a string like "22.5% THC"
 */
function extractPercentage(text) {
  if (!text) return null;
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Map a raw category string to our ProductCategory enum.
 */
function mapCategory(rawCategory) {
  const cat = (rawCategory || '').toLowerCase();
  if (cat.includes('flower') || cat.includes('bud')) return 'FLOWER';
  if (cat.includes('edible') || cat.includes('gumm') || cat.includes('candy') || cat.includes('chocolate')) return 'EDIBLES';
  if (cat.includes('vape') || cat.includes('cart') || cat.includes('pen')) return 'VAPE_CARTS';
  if (cat.includes('concentrate') || cat.includes('wax') || cat.includes('shatter') || cat.includes('rosin') || cat.includes('resin')) return 'CONCENTRATES';
  if (cat.includes('pre') && cat.includes('roll')) return 'PRE_ROLLS';
  if (cat.includes('tincture') || cat.includes('oil') || cat.includes('rso')) return 'TINCTURES';
  if (cat.includes('topical') || cat.includes('cream') || cat.includes('balm') || cat.includes('patch')) return 'TOPICALS';
  if (cat.includes('beverage') || cat.includes('drink') || cat.includes('soda') || cat.includes('lemon')) return 'BEVERAGES';
  if (cat.includes('accessor') || cat.includes('glass') || cat.includes('paper') || cat.includes('grinder')) return 'ACCESSORIES';
  return 'FLOWER';
}

/**
 * Map strain type string to enum.
 */
function mapStrain(strainStr) {
  const s = (strainStr || '').toLowerCase();
  if (s.includes('indica')) return 'INDICA';
  if (s.includes('sativa')) return 'SATIVA';
  if (s.includes('hybrid')) return 'HYBRID';
  if (s.includes('cbd')) return 'CBD';
  return null;
}

/**
 * Parse an effects string into an array.
 */
function parseEffects(effectsText) {
  if (!effectsText) return [];
  return effectsText
    .split(/[,;/|]/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// ─── Scraper ──────────────────────────────────────────────────────────────────

/**
 * Extract product details from a product page using Cheerio.
 */
function extractProductDetails(html, productUrl) {
  const $ = cheerio.load(html);

  // Product name — try common selectors
  const name =
    $('h1.product-title, h1.product_title, h1[class*="product"], .product-name h1, h1').first().text().trim() ||
    $('title').text().replace(/\s*[-|].*$/, '').trim();

  // Price
  const priceText =
    $('.price .amount, .woocommerce-Price-amount, [class*="price"] .amount, .price').first().text().trim();
  const price = parsePrice(priceText);

  // Description
  const description =
    $('[class*="product-description"], .woocommerce-product-details__short-description, .product-description, #tab-description .panel, .entry-summary p')
      .first()
      .text()
      .trim() || '';

  // Category from breadcrumbs or category meta
  const categoryText =
    $('.product-category, .product_cats, nav.woocommerce-breadcrumb a:last-child, .posted_in a').first().text().trim();
  const category = mapCategory(categoryText);

  // Images
  const images = [];
  $('figure.woocommerce-product-gallery__image img, .product-gallery img, .product img').each((_, el) => {
    const src = $(el).attr('data-large_image') || $(el).attr('src');
    if (src && !images.includes(src)) images.push(src);
  });

  // THC / CBD
  const fullText = $('body').text();
  const thcMatch = fullText.match(/THC[:\s]*(\d+(?:\.\d+)?)\s*%/i);
  const cbdMatch = fullText.match(/CBD[:\s]*(\d+(?:\.\d+)?)\s*%/i);
  const thcPercentage = thcMatch ? parseFloat(thcMatch[1]) : null;
  const cbdPercentage = cbdMatch ? parseFloat(cbdMatch[1]) : null;

  // Strain type
  const strainMatch = fullText.match(/\b(Indica|Sativa|Hybrid|CBD)\b/i);
  const strain = mapStrain(strainMatch ? strainMatch[1] : '');

  // Weight
  const weightMatch = fullText.match(/(\d+(?:\.\d+)?\s*(?:g|mg|oz|ml|pack)\b)/i);
  const weight = weightMatch ? weightMatch[1].trim() : null;

  // Effects — look for an "effects" section
  const effectsEl = $('*').filter((_, el) => /effects/i.test($(el).text())).first();
  const effectsText = effectsEl.next().text() || '';
  const effects = parseEffects(effectsText);

  // Stock status
  const outOfStock =
    $('.out-of-stock, .stock.out-of-stock, [class*="out-of-stock"]').length > 0 ||
    /out of stock/i.test(fullText.substring(0, 3000));
  const inStock = !outOfStock;

  return {
    sku: generateSku(name, category),
    name,
    slug: slugify(name),
    description,
    price,
    compareAtPrice: null,
    category,
    strain,
    thcPercentage,
    cbdPercentage,
    weight,
    effects,
    terpenes: [],
    images,
    inStock,
    stockQuantity: inStock ? 10 : 0,
    featured: false,
    sourceUrl: productUrl,
    reviews: [],
  };
}

/**
 * Scrape all products from the shop listing pages.
 */
async function scrapeShop(browser) {
  const page = await browser.newPage();

  // Block unnecessary resources to speed up scraping
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['font', 'stylesheet'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.setUserAgent(USER_AGENT);

  console.log(`\n📦 Fetching shop listing: ${SHOP_URL}`);
  await page.goto(SHOP_URL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Collect all product URLs from all pages
  const productUrls = new Set();
  let hasNextPage = true;
  let pageNum = 1;

  while (hasNextPage) {
    const html = await page.content();
    const $ = cheerio.load(html);

    // WooCommerce product links — validate hostname to prevent open-redirect scraping
    $('a.woocommerce-LoopProduct-link, ul.products li.product a:first-child, .product-item a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.includes('#')) return;
      try {
        const parsed = new URL(href);
        if (parsed.hostname === BASE_HOSTNAME) {
          productUrls.add(parsed.href);
        }
      } catch {
        // Relative URL — resolve against base
        try {
          const resolved = new URL(href, BASE_URL);
          if (resolved.hostname === BASE_HOSTNAME) {
            productUrls.add(resolved.href);
          }
        } catch {
          // Ignore malformed URLs
        }
      }
    });

    console.log(`  Page ${pageNum}: found ${productUrls.size} product URLs so far`);

    // Check for next page
    const nextPageLink = $('a.next.page-numbers, .woocommerce-pagination a.next').attr('href');
    if (nextPageLink) {
      pageNum++;
      await page.goto(nextPageLink, { waitUntil: 'networkidle2', timeout: 60000 });
    } else {
      hasNextPage = false;
    }
  }

  await page.close();
  return Array.from(productUrls);
}

/**
 * Scrape an individual product page and return structured data.
 */
async function scrapeProduct(browser, url) {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['font', 'stylesheet', 'media'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.setUserAgent(USER_AGENT);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    const html = await page.content();
    const product = extractProductDetails(html, url);
    await page.close();
    return product;
  } catch (err) {
    console.warn(`  ⚠️  Failed to scrape ${url}: ${err.message}`);
    await page.close();
    return null;
  }
}

/**
 * Main entry point.
 */
async function main() {
  console.log('🚀 High Society MN — Product Scraper');
  console.log('=====================================');
  console.log(`Target URL : ${SHOP_URL}`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  console.log(`Headless   : ${HEADLESS}`);
  console.log('');

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let products = [];

  try {
    // Step 1: Collect all product page URLs
    const productUrls = await scrapeShop(browser);

    if (productUrls.length === 0) {
      console.log(
        '\n⚠️  No product URLs found on the shop page.\n' +
        '   The site may use JavaScript-heavy rendering or the page structure may\n' +
        '   have changed. Review the selectors in scrapeShop() and extractProductDetails().'
      );
    } else {
      console.log(`\n✅ Found ${productUrls.length} product URLs. Scraping individual pages...\n`);

      // Step 2: Scrape each product page
      for (let i = 0; i < productUrls.length; i++) {
        const url = productUrls[i];
        process.stdout.write(`  [${i + 1}/${productUrls.length}] ${url.replace(BASE_URL, '')} ... `);
        const product = await scrapeProduct(browser, url);
        if (product && product.name) {
          products.push(product);
          console.log(`✅ "${product.name}" ($${product.price})`);
        } else {
          console.log('⚠️  skipped (empty)');
        }

        // Polite delay between requests
        await new Promise((r) => setTimeout(r, 1200));
      }
    }
  } finally {
    await browser.close();
  }

  // If no products were scraped (blocked/unavailable), load existing data
  if (products.length === 0) {
    const existingDataPath = path.join(__dirname, '..', 'data', 'products.json');
    if (OUTPUT_FILE !== existingDataPath && fs.existsSync(existingDataPath)) {
      console.log(
        '\n📂 Loading existing product data from data/products.json as fallback...'
      );
      products = JSON.parse(fs.readFileSync(existingDataPath, 'utf-8'));
    } else {
      console.log(
        '\n⚠️  No products were scraped. The output file will be empty.\n' +
        '   Run this script in an environment with access to highsocietymn.com.\n' +
        '   Alternatively, use the pre-populated data/products.json included in this\n' +
        '   repository as a starting point for the import script.'
      );
    }
  }

  // Write results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  console.log(`\n✅ Saved ${products.length} products → ${OUTPUT_FILE}`);
  console.log('\nNext step: run `node scripts/import-products.js` to seed the database.');
}

main().catch((err) => {
  console.error('\n❌ Scraper failed:', err.message);
  process.exit(1);
});
