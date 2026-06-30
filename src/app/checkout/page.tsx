"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MINNESOTA_CANNABIS_TAX_RATE } from "@/lib/constants";

const pickupSlots = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

export default function CheckoutPage() {
  const [fulfillmentType, setFulfillmentType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [address, setAddress] = useState("");
  const [slot, setSlot] = useState(pickupSlots[0]);
  const [note, setNote] = useState("");
  const router = useRouter();

  const submitDisabled = fulfillmentType === "DELIVERY" && !address.trim();

  const scheduledFor = useMemo(() => `${new Date().toISOString().slice(0, 10)} ${slot}`, [slot]);

  const placeOrder = async () => {
    const cartResponse = await fetch("/api/cart");
    const cartData = await cartResponse.json();
    const subtotal = cartData.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const tax = Number((subtotal * MINNESOTA_CANNABIS_TAX_RATE).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartData.rawItems,
        subtotal,
        tax,
        total,
        fulfillmentType,
        scheduledFor,
        deliveryAddress: address,
        specialNotes: note,
      }),
    });

    const order = await response.json();
    router.push(`/orders?created=${order.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Checkout</h1>
      <section className="card space-y-4">
        <div>
          <p className="text-sm font-semibold text-emerald-900">1) Fulfillment Type</p>
          <div className="mt-2 flex gap-2">
            <button className={`rounded-lg border px-3 py-2 ${fulfillmentType === "PICKUP" ? "border-emerald-700 bg-emerald-50" : "border-emerald-200"}`} onClick={() => setFulfillmentType("PICKUP")}>Pickup</button>
            <button className={`rounded-lg border px-3 py-2 ${fulfillmentType === "DELIVERY" ? "border-emerald-700 bg-emerald-50" : "border-emerald-200"}`} onClick={() => setFulfillmentType("DELIVERY")}>Delivery</button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-900">2) Schedule</p>
          <select className="mt-2 rounded-lg border border-emerald-200 px-3 py-2" value={slot} onChange={(event) => setSlot(event.target.value)}>
            {pickupSlots.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
        </div>
        {fulfillmentType === "DELIVERY" ? (
          <div>
            <p className="text-sm font-semibold text-emerald-900">3) Delivery Address</p>
            <input className="mt-2 w-full rounded-lg border border-emerald-200 px-3 py-2" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, City, ZIP" />
          </div>
        ) : null}
        <div>
          <p className="text-sm font-semibold text-emerald-900">Special notes</p>
          <textarea className="mt-2 w-full rounded-lg border border-emerald-200 px-3 py-2" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <button disabled={submitDisabled} className="btn disabled:cursor-not-allowed disabled:opacity-60" onClick={placeOrder}>Confirm order</button>
      </section>
    </div>
  );
}
