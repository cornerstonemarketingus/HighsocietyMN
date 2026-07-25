import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const ImageSchema = z.string().max(1_600_000).refine(
  (value) =>
    value.startsWith("/") ||
    value.startsWith("https://") ||
    /^data:image\/(png|jpe?g|webp);base64,/.test(value),
  "Use an uploaded image, a local path, or an HTTPS image URL.",
);

const ProductSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  description: z.string().trim().max(5000).optional().default(""),
  categoryId: z.string().min(1),
  brand: z.string().trim().max(120).optional().default(""),
  price: z.coerce.number().min(0),
  comparePrice: z.coerce.number().min(0).nullable().optional(),
  images: z.array(ImageSchema).min(1).max(6),
  stockQuantity: z.coerce.number().int().min(0).max(100000),
  inStock: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
});

async function requireStaff() {
  const session = await auth();
  return session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";
}

export async function POST(request: NextRequest) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const parsed = ProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the product details." },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const product = await db.product.create({
      data: {
        ...data,
        description: data.description || null,
        brand: data.brand || null,
        comparePrice: data.comparePrice || null,
        effects: [],
        flavors: [],
        terpenes: [],
      },
      include: { category: true },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "That slug or SKU is already in use." },
      { status: 409 },
    );
  }
}
