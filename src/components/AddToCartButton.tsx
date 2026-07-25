"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  async function add() {
    setState("loading");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setState(response.ok ? "added" : "error");
  }
  return (
    <Button size="lg" className="w-full gap-2" disabled={disabled || state === "loading"} onClick={add}>
      <ShoppingCart className="h-5 w-5" />
      {disabled ? "Out of stock" : state === "loading" ? "Adding…" : state === "added" ? "Added to bag" : state === "error" ? "Sign in to add" : "Add to bag"}
    </Button>
  );
}
