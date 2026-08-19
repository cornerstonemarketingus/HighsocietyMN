import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { releasePendingOrder } from "@/lib/order-inventory";

export async function GET(req: NextRequest) {
  const session = await auth();
  const orderId = req.nextUrl.searchParams.get("orderId");
  const destination = new URL("/cart?checkout=cancelled", req.nextUrl.origin);
  if (!session?.user?.id || !orderId) return NextResponse.redirect(destination);

  const order = await db.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: "PENDING" },
    select: { stripeSessionId: true },
  });
  if (!order?.stripeSessionId) return NextResponse.redirect(destination);

  try {
    await stripe.checkout.sessions.expire(order.stripeSessionId);
    await releasePendingOrder(orderId);
  } catch (error) {
    // A session that completed while the customer navigated back must remain paid.
    console.error("Checkout cancellation could not expire the Stripe session:", error);
  }
  return NextResponse.redirect(destination);
}
