ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "variants" JSONB,
  ADD COLUMN IF NOT EXISTS "requiredFields" JSONB;

ALTER TABLE "cart_items"
  ADD COLUMN IF NOT EXISTS "variantId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "variantLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "unitPrice" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "customization" JSONB;

DROP INDEX IF EXISTS "cart_items_userId_productId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_userId_productId_variantId_key"
  ON "cart_items"("userId", "productId", "variantId");

ALTER TABLE "order_items"
  ADD COLUMN IF NOT EXISTS "variantLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "customization" JSONB;
