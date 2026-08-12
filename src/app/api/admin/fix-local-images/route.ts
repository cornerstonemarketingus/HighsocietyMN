import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * One-off repair for products seeded with an empty `images` array even though a matching
 * photo already ships in public/products/<slug>.<ext> (see scripts/seed-production.mjs).
 * Only fills in products that currently have zero images — never overwrites real photos.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productsDir = path.join(process.cwd(), "public", "products");
  let files: string[];
  try {
    files = fs.readdirSync(productsDir);
  } catch {
    return NextResponse.json({ error: "No public/products directory found." }, { status: 404 });
  }

  const imageBySlug = new Map<string, string>();
  for (const file of files) {
    const ext = path.extname(file);
    if (![".webp", ".jpg", ".jpeg", ".png"].includes(ext.toLowerCase())) continue;
    const slug = path.basename(file, ext);
    imageBySlug.set(slug, `/products/${file}`);
  }

  const emptyImageProducts = await db.product.findMany({
    where: { images: { isEmpty: true } },
    select: { id: true, slug: true },
  });

  let fixed = 0;
  const stillMissing: string[] = [];
  for (const product of emptyImageProducts) {
    const image = imageBySlug.get(product.slug);
    if (!image) {
      stillMissing.push(product.slug);
      continue;
    }
    await db.product.update({ where: { id: product.id }, data: { images: [image] } });
    fixed += 1;
  }

  return NextResponse.json({ checked: emptyImageProducts.length, fixed, stillMissing });
}
