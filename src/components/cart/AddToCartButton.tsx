"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Check, LoaderCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/events";

export function AddToCartButton({ productId, inStock, className }: { productId: string; inStock: boolean; className?: string }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function add() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setState("loading");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (!response.ok) { setState("error"); return; }
    trackEvent("product.added", { productId });
    setState("added");
    router.refresh();
    window.setTimeout(() => setState("idle"), 1800);
  }

  return (
    <Button onClick={add} disabled={!inStock || state === "loading"} className={className} aria-live="polite">
      {state === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : state === "added" ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      <span className="ml-2">{!inStock ? "Out of stock" : state === "added" ? "Added" : state === "error" ? "Try again" : "Add to bag"}</span>
    </Button>
  );
}
