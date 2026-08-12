import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { scrapeAllProducts } from "@/lib/scraper";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const session = await auth();
  const cronAuthorized =
    Boolean(process.env.CRON_SECRET) &&
    req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  if ((!session?.user?.id || session.user.role !== "ADMIN") && !cronAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({ select: { id: true, slug: true } });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  let scraped: Awaited<ReturnType<typeof scrapeAllProducts>>;
  try {
    scraped = await scrapeAllProducts();
  } catch (error) {
    console.error("Product sync: scrape failed:", error);
    return NextResponse.json({ error: "Could not reach www.highsocietymn.com to sync products." }, { status: 502 });
  }

  if (scraped.length === 0) {
    return NextResponse.json({ error: "No products discovered. The source site's markup may not match the scraper's selectors.", synced: 0 }, { status: 200 });
  }

  const canUploadImages = isCloudinaryConfigured();
  let created = 0;
  let updated = 0;
  const skipped: string[] = [];

  for (const product of scraped) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) {
      skipped.push(`${product.name} (unknown category "${product.categorySlug}")`);
      continue;
    }

    const images: string[] = [];
    if (canUploadImages) {
      for (const src of product.images) {
        try {
          images.push(await uploadImageToCloudinary(src));
        } catch (error) {
          console.warn(`Product sync: image upload failed for ${product.slug}:`, error);
        }
      }
    }

    const existing = await db.product.findUnique({ where: { slug: product.slug }, select: { id: true, images: true } });

    const data = {
      name: product.name,
      description: product.description ?? undefined,
      categoryId,
      brand: product.brand ?? undefined,
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      images: images.length > 0 ? images : existing?.images ?? [],
      thcContent: product.thcContent ?? undefined,
      cbdContent: product.cbdContent ?? undefined,
      weight: product.weight ?? undefined,
      strain: product.strain ?? undefined,
      effects: product.effects,
      flavors: product.flavors,
      inStock: product.inStock,
      published: true,
    };

    if (existing) {
      await db.product.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await db.product.create({ data: { ...data, slug: product.slug } });
      created += 1;
    }
  }

  return NextResponse.json({
    synced: scraped.length,
    created,
    updated,
    skipped,
    imagesUploaded: canUploadImages,
    note: canUploadImages ? undefined : "CLOUDINARY_URL is not set — product data was synced but images were left as-is.",
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
