import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogDiagnostics,
  cleanText,
  extractProductFromDetailsPage,
  extractSitemapProductLinks,
  manifestChanges,
  normalizeWixImage,
  parseMoney,
} from "../scripts/scrape-products";

const baseUrl = "https://www.highsocietymn.com";

test("decodes descriptions and parses only explicitly labeled product facts", () => {
  const html = `
    <html><head>
      <link rel="canonical" href="${baseUrl}/product-page/golden-goat?ref=shop" />
      <script type="application/ld+json">${JSON.stringify({
        "@type": "Product",
        name: "Golden Goat",
        description: "Bright &amp; citrus-forward flower.",
        brand: { name: "High Society MN" },
        image: [{ url: "https://static.wixstatic.com/media/golden~mv2.jpg/v1/fill/w_147,h_147,blur_2/golden~mv2.jpg" }],
        offers: { price: "35.00", availability: "https://schema.org/InStock" },
      })}</script>
    </head><body><main>
      <h1>Golden Goat</h1><del>$45.00</del>
      <p>Strain: Sativa</p><p>Effects: Energetic, Creative</p>
      <p>Flavor: Citrus; Pine</p><p>Terpenes: Limonene / Pinene</p>
      <p>This unrelated paragraph contains the word relaxing.</p>
    </main></body></html>`;

  const product = extractProductFromDetailsPage(html, baseUrl);
  assert.equal(product.description, "Bright & citrus-forward flower.");
  assert.equal(product.brand, null);
  assert.equal(product.price, 35);
  assert.equal(product.comparePrice, 45);
  assert.equal(product.strain, "Sativa");
  assert.deepEqual(product.effects, ["Energetic", "Creative"]);
  assert.deepEqual(product.flavors, ["Citrus", "Pine"]);
  assert.deepEqual(product.terpenes, ["Limonene", "Pinene"]);
  assert.deepEqual(product.images, ["https://static.wixstatic.com/media/golden~mv2.jpg"]);
});

test("does not invent compare prices or structured claims from generic prose", () => {
  const html = `<html><head>
    <link rel="canonical" href="${baseUrl}/product-page/plain-product" />
    <meta property="og:title" content="Plain Product" />
    <meta property="product:price:amount" content="$25.00" />
  </head><body><main><p>A flavorful option that may feel relaxing.</p><del>$20</del></main></body></html>`;
  const product = extractProductFromDetailsPage(html, baseUrl);
  assert.equal(product.comparePrice, null);
  assert.equal(product.strain, null);
  assert.deepEqual(product.effects, []);
  assert.deepEqual(product.flavors, []);
  assert.deepEqual(product.terpenes, []);
});

test("normalizes Wix media and rejects object string artifacts", () => {
  assert.equal(normalizeWixImage("[object Object]"), null);
  assert.equal(
    normalizeWixImage("https://static.wixstatic.com/media/item~mv2.jpeg/v1/fill/w_147,h_147,blur_2/item~mv2.jpeg"),
    "https://static.wixstatic.com/media/item~mv2.jpeg",
  );
  assert.equal(normalizeWixImage({ url: "https://static.wixstatic.com/media/item~mv2.png" }), "https://static.wixstatic.com/media/item~mv2.png");
});

test("reports incomplete crawls and slug collisions before reconciliation", () => {
  const sitemap = extractSitemapProductLinks(`
    <urlset><url><loc>${baseUrl}/product-page/a</loc></url><url><loc>${baseUrl}/product-page/b</loc></url></urlset>
  `, baseUrl);
  const diagnostic = catalogDiagnostics(sitemap, [
    { sourceUrl: `${baseUrl}/product-page/a?source=shop`, product: { slug: "same", images: [] } },
    { sourceUrl: `${baseUrl}/product-page/extra`, product: { slug: "same", images: ["image.jpg"] } },
  ], baseUrl);
  assert.deepEqual(diagnostic.missingUrls, [`${baseUrl}/product-page/b`]);
  assert.deepEqual(diagnostic.duplicateSlugs, ["same"]);
  assert.deepEqual(diagnostic.productsWithoutImages, ["same"]);
});

test("detects an unstable source manifest before stale products are unpublished", () => {
  assert.deepEqual(
    manifestChanges(
      [`${baseUrl}/product-page/a`, `${baseUrl}/product-page/b`],
      [`${baseUrl}/product-page/b?cache=2`, `${baseUrl}/product-page/c`],
      baseUrl,
    ),
    { added: [`${baseUrl}/product-page/c`], removed: [`${baseUrl}/product-page/a`] },
  );
});

test("money parsing selects one currency amount instead of concatenating prices", () => {
  assert.equal(parseMoney("$35.00"), 35);
  assert.equal(parseMoney("$35.00 $45.00"), 35);
  assert.equal(parseMoney("Call for price"), null);
  assert.equal(cleanText("A &amp; B\n C"), "A & B C");
});
