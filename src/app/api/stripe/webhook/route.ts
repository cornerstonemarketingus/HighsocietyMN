import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { isPaidSessionValid, shouldConfirmOrder, toCents } from "@/lib/checkout";
import { releasePendingOrder } from "@/lib/order-inventory";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  const orderId = checkoutSession.metadata?.orderId;
  if (!orderId) return NextResponse.json({ received: true });

  if (event.type === "checkout.session.completed") {
    const order = await db.order.findUnique({ where: { id: orderId }, select: { status: true, total: true } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (!shouldConfirmOrder(order.status)) return NextResponse.json({ received: true });
    if (!isPaidSessionValid({ paymentStatus: checkoutSession.payment_status, amountTotal: checkoutSession.amount_total, expectedTotalCents: toCents(order.total) })) {
      console.error("Stripe payment total/status mismatch", { orderId, sessionId: checkoutSession.id });
      return NextResponse.json({ error: "Payment does not match order" }, { status: 409 });
    }

    await db.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: {
        status: "CONFIRMED",
        stripeSessionId: checkoutSession.id,
        stripePaymentId: typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : checkoutSession.payment_intent?.id,
      },
    });
  } else if (event.type === "checkout.session.expired") {
    await releasePendingOrder(orderId);
  }

  return NextResponse.json({ received: true });
}
