#!/usr/bin/env node
/**
 * scripts/import-products.js
 *
 * Reads scraped product data from data/products.json (or a custom path),
 * downloads & optionally uploads images, then upserts all products into
 * the PostgreSQL database via Prisma.
 *
 * Usage:
 *   node scripts/import-products.js
 *   node scripts/import-products.js --input ./data/products.json
 *   node scripts/import-products.js --dry-run
 *   node scripts/import-products.js --skip-images
 *
 * Environment variables required:
 *   DATABASE_URL          — PostgreSQL connection string
 *   CLOUDINARY_CLOUD_NAME — (optional) Cloudinary cloud name
 *   CLOUDINARY_API_KEY    — (optional) Cloudinary API key
 *   CLOUDINARY_API_SECRET — (optional) Cloudinary API secret
 *
 * Dependencies:
 *   npm install @prisma/client axios
 */

'use strict';

const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// ─── CLI Arguments ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const getArg = (name, defaultVal) => {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
};

const INPUT_FILE = getArg('--input', path.join(__dirname, '..', 'data', 'products.json'));
const DRY_RUN = hasFlag('--dry-run');
const SKIP_IMAGES = hasFlag('--skip-images');
const CLOUDINARY_UPLOAD = hasFlag('--cloudinary') && !SKIP_IMAGES;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

const log = {
  info: (msg) => console.log(`${CYAN}ℹ${RESET}  ${msg}`),
  success: (msg) => console.log(`${GREEN}✅${RESET} ${msg}`),
  warn: (msg) => console.log(`${YELLOW}⚠️ ${RESET} ${msg}`),
  error: (msg) => console.log(`${RED}❌${RESET} ${msg}`),
  step: (msg) => console.log(`\n${CYAN}▶${RESET}  ${msg}`),
};

/**
 * Download a file from a URL and return a Buffer.
 */
function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Upload an image to Cloudinary and return the secure URL.
 * Requires cloudinary npm package and env vars.
 */
async function uploadToCloudinary(imageUrl, folder = 'highsocietymn/products') {
  let cloudinary;
  try {
    cloudinary = require('cloudinary').v2;
  } catch {
    log.warn('cloudinary package not found. Run: npm install cloudinary');
    return imageUrl;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (err) {
    log.warn(`Cloudinary upload failed for ${imageUrl}: ${err.message}`);
    return imageUrl; // Fall back to original URL
  }
}

/**
 * Process images: optionally upload to Cloudinary or return as-is.
 */
async function processImages(images) {
  if (SKIP_IMAGES || !images || images.length === 0) return images || [];

  if (CLOUDINARY_UPLOAD) {
    const processed = [];
    for (const img of images) {
      process.stdout.write(`    📸 Uploading image... `);
      const url = await uploadToCloudinary(img);
      processed.push(url);
      console.log(url === img ? '(kept original)' : '✅');
    }
    return processed;
  }

  return images;
}

/**
 * Map raw product data to Prisma-compatible shape.
 */
function mapToPrismaProduct(raw) {
  return {
    sku: raw.sku,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    price: typeof raw.price === 'number' ? raw.price : parseFloat(raw.price) || 0,
    compareAtPrice: raw.compareAtPrice || null,
    category: raw.category || 'FLOWER',
    strain: raw.strain || null,
    thcPercentage: raw.thcPercentage || null,
    cbdPercentage: raw.cbdPercentage || null,
    weight: raw.weight || null,
    effects: Array.isArray(raw.effects) ? raw.effects : [],
    terpenes: Array.isArray(raw.terpenes) ? raw.terpenes : [],
    images: [], // filled in after image processing
    inStock: raw.inStock !== false,
    stockQuantity: typeof raw.stockQuantity === 'number' ? raw.stockQuantity : 0,
    featured: raw.featured === true,
  };
}

// ─── Import Logic ─────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🌿 High Society MN — Product Import Script');
  console.log('==========================================');
  console.log(`Input file : ${INPUT_FILE}`);
  console.log(`Dry run    : ${DRY_RUN}`);
  console.log(`Skip images: ${SKIP_IMAGES}`);
  console.log(`Cloudinary : ${CLOUDINARY_UPLOAD}`);
  console.log('');

  // ── 1. Load product data ──────────────────────────────────────────────────

  if (!fs.existsSync(INPUT_FILE)) {
    log.error(`Input file not found: ${INPUT_FILE}`);
    log.info('Run `node scripts/scrape-highsociety.js` first to generate product data,');
    log.info('or point to an existing products.json with --input <path>');
    process.exit(1);
  }

  let products;
  try {
    products = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  } catch (err) {
    log.error(`Failed to parse ${INPUT_FILE}: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(products) || products.length === 0) {
    log.warn('No products found in input file. Nothing to import.');
    process.exit(0);
  }

  log.info(`Loaded ${products.length} products from ${INPUT_FILE}`);

  // ── 2. Import to database ────────────────────────────────────────────────

  if (DRY_RUN) {
    log.step('DRY RUN — no database writes will be performed');
    console.log('\nProducts that would be imported:');
    products.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p.category}] ${p.name} — $${p.price} (${p.inStock ? 'In Stock' : 'Out of Stock'})`);
    });
    const total = products.length;
    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log(`\nSummary: ${total} products across ${Object.keys(byCategory).length} categories`);
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
    return;
  }

  // Lazy-load Prisma so the script can still run --dry-run without a DB
  let prisma;
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({ log: ['error'] });
  } catch (err) {
    log.error('Failed to initialize Prisma. Have you run `npx prisma generate`?');
    log.error(err.message);
    process.exit(1);
  }

  const stats = { created: 0, updated: 0, skipped: 0, errors: 0 };

  log.step(`Importing ${products.length} products into the database...`);

  for (let i = 0; i < products.length; i++) {
    const raw = products[i];
    if (!raw.name || !raw.sku) {
      log.warn(`  Skipping product at index ${i}: missing name or SKU`);
      stats.skipped++;
      continue;
    }

    process.stdout.write(`  [${i + 1}/${products.length}] ${raw.name} ... `);

    try {
      // Process images
      const processedImages = await processImages(raw.images);

      const productData = {
        ...mapToPrismaProduct(raw),
        images: processedImages,
      };

      // Upsert product (insert or update based on SKU)
      const existing = await prisma.product.findUnique({ where: { sku: raw.sku } });

      let product;
      if (existing) {
        product = await prisma.product.update({
          where: { sku: raw.sku },
          data: productData,
        });
        console.log(`updated`);
        stats.updated++;
      } else {
        product = await prisma.product.create({ data: productData });
        console.log(`created`);
        stats.created++;
      }

      // Seed reviews if provided and product is new
      if (!existing && Array.isArray(raw.reviews) && raw.reviews.length > 0) {
        for (const rev of raw.reviews) {
          await prisma.review.create({
            data: {
              productId: product.id,
              rating: rev.rating || 5,
              comment: rev.comment || '',
              verified: rev.verified === true,
            },
          });
        }
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      stats.errors++;
    }
  }

  await prisma.$disconnect();

  // ── 3. Summary ───────────────────────────────────────────────────────────

  console.log('\n');
  console.log('════════════════════════════════════════');
  console.log('  Import Complete');
  console.log('════════════════════════════════════════');
  log.success(`Created : ${stats.created}`);
  if (stats.updated > 0) log.info(`Updated : ${stats.updated}`);
  if (stats.skipped > 0) log.warn(`Skipped : ${stats.skipped}`);
  if (stats.errors > 0) log.error(`Errors  : ${stats.errors}`);
  console.log('────────────────────────────────────────');
  log.success(`Total   : ${stats.created + stats.updated}/${products.length} products in database`);
  console.log('');
  log.info('Run `npx prisma studio` to browse the imported data.');
}

run().catch((err) => {
  log.error(`Import failed: ${err.message}`);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
