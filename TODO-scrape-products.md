# TODO — Scrape products from highsocietymn.com

## Plan
- [ ] Discover site URL structure for categories + product detail pages (needs browser URLs)
- [ ] Implement `scripts/scrape-products.ts` using HTML fetching + cheerio parsing
- [ ] Implement upsert into Prisma: Category + Product (images, price, comparePrice, sku, stockQuantity, featured/published)
- [ ] Add pagination support if category pages have pagination
- [ ] Add `--dry-run` and `--concurrency` flags
- [ ] Run scraper locally, verify counts in admin UI (`/admin/products`)
- [ ] Resolve any parsing issues and iterate until full coverage

