import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(`/orders/${id}`)}`);
  const order = await db.order.findFirst({ where: { id, userId: session.user.id }, include: { items: true } });
  if (!order) notFound();
  const confirmed = ["CONFIRMED", "READY", "COMPLETED"].includes(order.status);
  const cancelled = ["CANCELLED", "REFUNDED"].includes(order.status);
  const title = confirmed ? "Your delivery order is confirmed." : cancelled ? "This order is no longer active." : "Payment is processing.";
  const description = confirmed
    ? "High Society will follow up with delivery details. Keep your valid ID ready for the handoff."
    : cancelled
      ? "No payment is due for this order. Any reserved products have been returned to your bag when available."
      : "Stripe is confirming payment. Please do not submit a second order.";
  return <div className="min-h-screen bg-black text-white"><Header /><main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"><div className="border border-[#8a5710]/30 bg-[#0e0e0c] p-7 sm:p-10">{confirmed ? <CheckCircle2 className="h-9 w-9 text-[#e5a12b]" /> : <Clock3 className="h-9 w-9 text-[#e5a12b]" />}<p className="eyebrow mt-7">Order {order.orderNumber}</p><h1 className="mt-3 text-3xl font-medium">{title}</h1><p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{order.items.map(item => <div key={item.id} className="flex justify-between gap-4 py-4 text-sm"><span className="text-zinc-300">{item.quantity} × {item.name}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}</div><div className="mt-6 flex justify-between text-lg font-semibold"><span>Total</span><span className="text-[#ffc263]">{formatPrice(order.total)}</span></div><Link href="/products" className="mt-8 inline-flex h-11 items-center bg-[#e5a12b] px-5 text-sm font-semibold text-black">Return to collection</Link></div></main><Footer /></div>;
}
