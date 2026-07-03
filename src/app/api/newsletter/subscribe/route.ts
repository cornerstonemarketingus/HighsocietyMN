import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function generateDiscountCode(): string {
  const prefix = "HS10";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        message: "Already subscribed",
        discountCode: existing.discountCode,
        alreadySubscribed: true,
      });
    }

    // Generate unique discount code
    let discountCode = generateDiscountCode();
    // Ensure uniqueness (collision is extremely unlikely but handle gracefully)
    let attempt = 0;
    while (attempt < 5) {
      const conflict = await db.newsletterSubscriber.findUnique({ where: { discountCode } });
      if (!conflict) break;
      discountCode = generateDiscountCode();
      attempt++;
      if (attempt === 5) {
        return NextResponse.json({ error: "Could not generate unique code, please try again." }, { status: 500 });
      }
    }

    const subscriber = await db.newsletterSubscriber.create({
      data: { email, discountCode },
    });

    return NextResponse.json({
      message: "Subscribed! Your 10% discount code is ready.",
      discountCode: subscriber.discountCode,
      alreadySubscribed: false,
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
